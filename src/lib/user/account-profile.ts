/** Normalizes Prisma/JSON date values to `YYYY-MM-DD` for `<input type="date">`. */
export function formatBirthDateForInput(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') {
    const m = /^(\d{4}-\d{2}-\d{2})/.exec(value.trim());
    if (m) return m[1];
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return toYmdUtc(d);
  }
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return '';
    return toYmdUtc(value);
  }
  return '';
}

function toYmdUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export type MeUserProfile = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  phone?: string | null;
  birthDate?: unknown;
  address?: string | null;
  country?: string | null;
  taxId?: string | null;
};

export function profileFieldsFromMeUser(user: MeUserProfile | null | undefined) {
  if (!user) {
    return {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: '',
      address: '',
      taxIdNumber: '',
    };
  }
  return {
    name: user.name?.trim() ?? '',
    email: user.email?.trim() ?? '',
    phone: user.phone?.trim() ?? '',
    dateOfBirth: formatBirthDateForInput(user.birthDate),
    nationality: user.country?.trim() ?? '',
    address: user.address?.trim() ?? '',
    taxIdNumber: user.taxId?.trim() ?? '',
  };
}

type SavedAiBlob = unknown;

/** Dashboard profile: saved travel blob wins when non-empty; otherwise account. */
export function mergeDashboardProfileFromSources(
  account: ReturnType<typeof profileFieldsFromMeUser>,
  saved: SavedAiBlob,
) {
  const s = saved && typeof saved === 'object' && !Array.isArray(saved) ? (saved as Record<string, unknown>) : {};
  const pick = (savedKey: string, accountVal: string) => {
    const raw = s[savedKey];
    return isNonEmptyString(raw) ? String(raw).trim() : accountVal;
  };
  return {
    name: pick('fullName', account.name),
    email: pick('email', account.email),
    phone: pick('phone', account.phone),
    dateOfBirth: pick('dateOfBirth', account.dateOfBirth),
    nationality: pick('nationality', account.nationality),
    passportNumber: isNonEmptyString(s.passportNumber) ? String(s.passportNumber).trim() : '',
    nationalIdNumber: isNonEmptyString(s.nationalIdNumber) ? String(s.nationalIdNumber).trim() : '',
    taxIdNumber: pick('taxIdNumber', account.taxIdNumber),
    address: pick('address', account.address),
  };
}

/** After merging saved travel preferences, fill empty identity fields from the account. */
export function applyAccountToTravelPreferences<T extends object>(
  prefs: T,
  user: MeUserProfile | null | undefined,
): T {
  const a = profileFieldsFromMeUser(user ?? null);
  const out = { ...prefs } as Record<string, unknown>;
  if (!isNonEmptyString(out.fullName)) out.fullName = a.name;
  if (!isNonEmptyString(out.email)) out.email = a.email;
  if (!isNonEmptyString(out.phone)) out.phone = a.phone;
  if (!isNonEmptyString(out.dateOfBirth)) out.dateOfBirth = a.dateOfBirth;
  if (!isNonEmptyString(out.nationality)) out.nationality = a.nationality;
  if (!isNonEmptyString(out.taxIdNumber)) out.taxIdNumber = a.taxIdNumber;
  return out as T;
}

/** Overlay saved JSON onto defaults without clobbering with undefined. */
export function mergeSavedTravelPreferences<T extends object>(base: T, saved: unknown): T {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return { ...base };
  const out = { ...base } as Record<string, unknown>;
  for (const [k, v] of Object.entries(saved as Record<string, unknown>)) {
    if (k in out && v !== undefined) out[k] = v;
  }
  return out as T;
}
