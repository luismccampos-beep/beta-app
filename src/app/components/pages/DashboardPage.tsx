import { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import {
  mergeDashboardProfileFromSources,
  profileFieldsFromMeUser,
  type MeUserProfile,
} from '../../../lib/user/account-profile';
import {
  User,
  Plane,
  Calendar,
  MapPin,
  CreditCard,
  Settings,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  Globe,
  Briefcase,
  TreePalm,
  Hotel,
  Utensils,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Check,
  Camera,
  Trash2,
  Smartphone,
  Monitor,
  Laptop,
  LogOut,
  AlertTriangle,
  QrCode,
  Copy,
  BadgeCheck,
  BadgeAlert,
  Send,
} from 'lucide-react';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { AppHeader } from '../AppHeader';
import { cn } from '../ui/utils';

type TabType = 'bookings' | 'history' | 'profile' | 'preferences';

type SavedPreferences = {
  budgetRange?: number[];
  currency?: string;
  preferredDestinations?: string[];
  travelStyles?: string[];
  accommodationType?: string[];
  activityTypes?: string[];
  dietaryRestrictions?: string[];
};

interface DashboardPageProps {
  onBack: () => void;
  onNewBooking?: () => void;
  initialTab?: TabType;
}

interface Booking {
  id: string;
  destination: string;
  dates: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  price: string;
  type: string;
  bookingDate: string;
}

interface TravelHistory {
  id: string;
  destination: string;
  dates: string;
  rating: number;
  type: string;
}

// ── Profile completeness helpers ──

const PROFILE_FIELDS = [
  { key: 'name', label: 'Full name', weight: 2 },
  { key: 'email', label: 'Email', weight: 2 },
  { key: 'phone', label: 'Phone', weight: 1 },
  { key: 'dateOfBirth', label: 'Date of birth', weight: 1 },
  { key: 'nationality', label: 'Nationality', weight: 1 },
  { key: 'address', label: 'Address', weight: 1 },
] as const;

function calcCompleteness(data: Record<string, string>) {
  let filled = 0;
  let total = 0;
  for (const f of PROFILE_FIELDS) {
    total += f.weight;
    if (data[f.key]?.trim()) filled += f.weight;
  }
  return Math.round((filled / total) * 100);
}

// ── Validation helpers ──

function isValidEmail(value: string) {
  if (!value) return true; // empty = no error (not required)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  if (!value) return true;
  return /^[+\d\s\-().]{7,20}$/.test(value);
}

// ── Extracted helper components (outside DashboardPage to avoid re-creation) ──

const SectionCard = ({ icon: Icon, title, children, className }: { icon: typeof User; title: string; children: React.ReactNode; className?: string }) => (
  <Card className={cn('group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300', className)}>
    <CardHeader className="pb-2 pt-4 px-5">
      <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-5 pb-5 pt-1">{children}</CardContent>
  </Card>
);

const FormField = ({ label, icon: Icon, htmlFor, required, error, children }: { label: string; icon: typeof User; htmlFor?: string; required?: boolean; error?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-xs font-medium text-gray-500 dark:text-gray-400">
      {label}
      {required && <span className="text-red-500 dark:text-red-400 ml-0.5">*</span>}
    </label>
    <div className="relative">
      <Icon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      {children}
    </div>
    {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
  </div>
);

export function DashboardPage({ onBack, onNewBooking, initialTab }: DashboardPageProps) {
  const locale = useLocale();
  const t = useTranslations('dashboard');
  const [activeTab, setActiveTab] = useState<TabType>(initialTab ?? 'bookings');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savedPreferences, setSavedPreferences] = useState<SavedPreferences | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [hbAccommodationLabels, setHbAccommodationLabels] = useState<Record<string, string>>({});
  const [avatarReady, setAvatarReady] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 2FA state
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [twoFaSetupData, setTwoFaSetupData] = useState<{ secret: string; uri: string } | null>(null);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaBackupCodes, setTwoFaBackupCodes] = useState<string[]>([]);
  const [isSettingUp2fa, setIsSettingUp2fa] = useState(false);
  const [isVerifying2fa, setIsVerifying2fa] = useState(false);
  const [isDisabling2fa, setIsDisabling2fa] = useState(false);
  const [disable2faPassword, setDisable2faPassword] = useState('');
  const [showDisable2fa, setShowDisable2fa] = useState(false);

  // Sessions state
  const [sessions, setSessions] = useState<Array<{ id: string; device: Record<string, unknown>; ipAddress: string | null; createdAt: string; lastUsedAt: string; isCurrent: boolean }>>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isRevokingSession, setIsRevokingSession] = useState<string | null>(null);

  // Email verification state
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAvatarReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    nationalIdNumber: '',
    taxIdNumber: '',
    address: '',
  });

  const completeness = useMemo(() => calcCompleteness(profileData), [profileData]);

  // Field-level validation errors (only shown in edit mode)
  const fieldErrors = useMemo(() => {
    if (!isEditingProfile) return {};
    return {
      email: !isValidEmail(profileData.email) ? 'Invalid email format' : undefined,
      phone: !isValidPhone(profileData.phone) ? 'Invalid phone format' : undefined,
    };
  }, [isEditingProfile, profileData.email, profileData.phone]);

  useEffect(() => {
    if (activeTab !== 'preferences') return;
    fetch(`/api/travel/catalog?locale=${encodeURIComponent(locale)}`)
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          accommodations?: { code: string; label: string }[];
        };
        if (!res.ok) return;
        const map: Record<string, string> = {};
        for (const row of data.accommodations ?? []) {
          if (row.code && row.label) map[row.code] = row.label;
        }
        setHbAccommodationLabels(map);
      })
      .catch(() => setHbAccommodationLabels({}));
  }, [activeTab, locale]);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingPreferences(true);
    setIsLoadingProfile(true);
    Promise.all([
      fetch('/api/auth/me', { credentials: 'include' }).then((r) => r.json()),
      fetch('/api/user/preferences', { credentials: 'include' }).then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          authenticated?: boolean;
          preference?: { aiSettings?: unknown };
        };
        if (!res.ok || data.authenticated === false) return null;
        return data.preference?.aiSettings ?? null;
      }),
    ])
      .then(([me, aiSettings]) => {
        if (cancelled) return;
        const user =
          me &&
          typeof me === 'object' &&
          (me as { authenticated?: boolean }).authenticated === true &&
          (me as { user?: unknown }).user &&
          typeof (me as { user: unknown }).user === 'object'
            ? ((me as { user: MeUserProfile }).user)
            : null;
        const account = profileFieldsFromMeUser(user);
        setProfileData(mergeDashboardProfileFromSources(account, aiSettings));
        if (user && 'profileImage' in user && (user as Record<string, unknown>).profileImage) setAvatarUrl(String((user as Record<string, unknown>).profileImage));
        if (user && 'emailVerified' in user) setEmailVerified(Boolean((user as Record<string, unknown>).emailVerified));
        setSavedPreferences(
          aiSettings && typeof aiSettings === 'object' ? (aiSettings as SavedPreferences) : null,
        );
      })
      .catch(() => {
        if (!cancelled) setSavedPreferences(null);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingProfile(false);
          setIsLoadingPreferences(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const mockBookings: Booking[] = [];
  const mockHistory: TravelHistory[] = [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'pending': return 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800';
      case 'cancelled': return 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'cancelled': return <XCircle className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'}>★</span>
    ));

  const skeletonCls = 'h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse';

  const initials = profileData.name
    ? profileData.name.split(/\s+/).filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // ── Avatar handlers ──

  const handleAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error(t('avatarUploadFailed'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('avatarUploadFailed'));
      return;
    }
    setIsUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const res = await fetch('/api/auth/me/avatar', { method: 'POST', credentials: 'include', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json() as { avatarUrl?: string };
      if (data.avatarUrl) setAvatarUrl(data.avatarUrl);
      toast.success(t('avatarUpdated'));
    } catch {
      toast.error(t('avatarUploadFailed'));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarDelete = async () => {
    try {
      const res = await fetch('/api/auth/me/avatar', { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      setAvatarUrl(null);
      toast.success(t('avatarUpdated'));
    } catch {
      toast.error(t('avatarUploadFailed'));
    }
  };

  // ── 2FA handlers ──

  const fetch2faStatus = async () => {
    try {
      const res = await fetch('/api/auth/me/2fa', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json() as { enabled: boolean; secret?: string; uri?: string; hasBackupCodes?: boolean };
      setTwoFaEnabled(data.enabled);
      if (!data.enabled && data.secret && data.uri) {
        setTwoFaSetupData({ secret: data.secret, uri: data.uri });
      }
    } catch { /* ignore */ }
  };

  const handleEnable2fa = async () => {
    if (!twoFaCode || twoFaCode.length !== 6) {
      toast.error(t('twoFaInvalidCode'));
      return;
    }
    setIsVerifying2fa(true);
    try {
      const res = await fetch('/api/auth/me/2fa', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code: twoFaCode }),
      });
      const data = await res.json() as { success?: boolean; backupCodes?: string[]; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to verify');
      setTwoFaEnabled(true);
      setTwoFaBackupCodes(data.backupCodes ?? []);
      setTwoFaCode('');
      setTwoFaSetupData(null);
      toast.success(t('twoFaEnabled'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('twoFaFailed'));
    } finally {
      setIsVerifying2fa(false);
    }
  };

  const handleDisable2fa = async () => {
    if (!disable2faPassword) {
      toast.error(t('passwordRequired'));
      return;
    }
    setIsDisabling2fa(true);
    try {
      const res = await fetch('/api/auth/me/2fa', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: disable2faPassword }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to disable');
      setTwoFaEnabled(false);
      setTwoFaBackupCodes([]);
      setDisable2faPassword('');
      setShowDisable2fa(false);
      toast.success(t('twoFaDisabled'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('twoFaFailed'));
    } finally {
      setIsDisabling2fa(false);
    }
  };

  const handleStart2faSetup = async () => {
    setIsSettingUp2fa(true);
    try {
      await fetch2faStatus();
    } finally {
      setIsSettingUp2fa(false);
    }
  };

  // ── Session handlers ──

  const fetchSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const res = await fetch('/api/auth/me/sessions', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json() as { sessions?: Array<{ id: string; device: Record<string, unknown>; ipAddress: string | null; createdAt: string; lastUsedAt: string; isCurrent: boolean }> };
      setSessions(data.sessions ?? []);
    } catch { /* ignore */ }
    setIsLoadingSessions(false);
  };

  const handleRevokeSession = async (sessionId: string) => {
    setIsRevokingSession(sessionId);
    try {
      const res = await fetch('/api/auth/me/sessions', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error('Failed to revoke');
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success(t('sessionRevoked'));
    } catch {
      toast.error(t('sessionRevokeFailed'));
    } finally {
      setIsRevokingSession(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const res = await fetch('/api/auth/me/sessions', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json() as { success?: boolean; revokedCount?: number };
      if (!res.ok) throw new Error('Failed to revoke');
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      toast.success(t('allSessionsRevoked'));
    } catch {
      toast.error(t('sessionRevokeFailed'));
    }
  };

  const getDeviceIcon = (deviceInfo: Record<string, unknown>) => {
    const ua = String(deviceInfo.userAgent ?? deviceInfo.browser ?? '').toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return Smartphone;
    if (ua.includes('mac') || ua.includes('linux')) return Monitor;
    return Laptop;
  };

  const getDeviceLabel = (deviceInfo: Record<string, unknown>) => {
    if (deviceInfo.browser && deviceInfo.os) return `${String(deviceInfo.browser)} on ${String(deviceInfo.os)}`;
    const ua = String(deviceInfo.userAgent ?? '');
    if (!ua) return t('unknownDevice');
    // Simple extraction
    const match = ua.match(/\(([^)]+)\)/);
    return match ? match[1].split(';')[0].trim() : t('unknownDevice');
  };

  // ── Email verification handler ──

  const handleResendVerification = async () => {
    setIsSendingVerification(true);
    try {
      const res = await fetch('/api/auth/me/verify-email', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || 'Failed to send verification');
      }
      toast.success(t('verificationEmailSent'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t('verificationSendFailed'));
    } finally {
      setIsSendingVerification(false);
    }
  };

  // Fetch 2FA status and sessions on mount
  useEffect(() => {
    fetch2faStatus();
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Password handler ──

  const handlePasswordChange = async () => {
    if (!passwordData.current || !passwordData.newPass) {
      toast.error(t('passwordRequired'));
      return;
    }
    if (passwordData.newPass !== passwordData.confirm) {
      toast.error(t('passwordMismatch'));
      return;
    }
    if (passwordData.newPass.length < 8) {
      toast.error(t('passwordTooShort'));
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/auth/me/password', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordData.current, newPassword: passwordData.newPass }),
      });
      if (!res.ok) throw new Error('Password change failed');
      toast.success(t('passwordChanged'));
      setPasswordData({ current: '', newPass: '', confirm: '' });
    } catch {
      toast.error(t('passwordChangeFailed'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  const completenessColor = completeness >= 80 ? 'text-emerald-600 dark:text-emerald-400' : completeness >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400';
  const completenessBarColor = completeness >= 80 ? 'bg-emerald-500' : completeness >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <AppHeader showBack onBack={onBack} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
        {/* ── Hero ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-4">
              {/* Avatar with upload & delete */}
              <div className="relative group">
                <div className={cn(
                  'w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl text-white text-lg sm:text-xl font-bold overflow-hidden transition-all duration-300',
                  avatarUrl ? '' : 'bg-gradient-to-br from-teal-600 to-orange-500'
                )}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className={`transition-opacity duration-700 ${avatarReady ? 'opacity-100' : 'opacity-0'}`}>
                      {initials}
                    </span>
                  )}
                </div>
                {/* Upload overlay */}
                <button
                  onClick={() => document.getElementById('avatar-input')?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  aria-label="Upload avatar"
                >
                  <Camera className="h-5 w-5 text-white" />
                </button>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleAvatarUpload(f); }}
                />
                {/* Delete button (shown only when avatar exists) */}
                {avatarUrl && (
                  <button
                    onClick={handleAvatarDelete}
                    disabled={isUploadingAvatar}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    aria-label="Delete avatar"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
              </div>
            </div>
            {onNewBooking && (
              <Button
                onClick={onNewBooking}
                className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white gap-2 max-sm:hidden shadow-sm"
              >
                <Plane className="w-4 h-4" />
                {t('newBooking')}
              </Button>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-1 pb-2 min-w-max sm:min-w-0 border-b border-gray-200 dark:border-gray-700">
            {([
              { id: 'bookings' as TabType, label: t('tabBookings'), icon: Calendar },
              { id: 'history' as TabType, label: t('tabHistory'), icon: Clock },
              { id: 'profile' as TabType, label: t('tabProfile'), icon: User },
              { id: 'preferences' as TabType, label: t('tabPreferences'), icon: Settings },
            ]).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 sm:px-5 py-3 font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm rounded-t-lg border-b-2',
                    activeTab === tab.id
                      ? 'border-teal-600 dark:border-orange-500 text-teal-700 dark:text-orange-400 bg-white/60 dark:bg-gray-800/60'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="space-y-6">

          {/* ═══ BOOKINGS TAB ═══ */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('activeBookings')}</h2>
              {mockBookings.length === 0 ? (
                <Card className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
                  <CardContent className="p-12 text-center">
                    <Plane className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t('noBookings')}</p>
                    <Button
                      onClick={onNewBooking}
                      className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white"
                    >
                      {t('bookNow')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {mockBookings.map((booking) => (
                    <Card key={booking.id} className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                              <h3 className="font-semibold text-gray-900 dark:text-white">{booking.destination}</h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {booking.dates}
                            </p>
                          </div>
                          <Badge className={cn('text-xs gap-1.5 px-2.5 py-1 rounded-full', getStatusColor(booking.status))}>
                            {getStatusIcon(booking.status)}
                            {booking.status === 'confirmed' ? t('confirmed') : booking.status === 'pending' ? t('pending') : t('cancelled')}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{booking.type}</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-white">{booking.price}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" className="flex-1 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {t('viewDetails')}
                          </Button>
                          {booking.status !== 'cancelled' && (
                            <Button variant="outline" size="sm" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30">
                              {t('cancelBooking')}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ HISTORY TAB ═══ */}
          {activeTab === 'history' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('pastTrips')}</h2>
              {mockHistory.length === 0 ? (
                <Card className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
                  <CardContent className="p-12 text-center">
                    <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 dark:text-gray-400">{t('noHistory')}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockHistory.map((trip) => (
                    <Card key={trip.id} className="group overflow-hidden border-0 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg ring-1 ring-gray-200/60 dark:ring-gray-700/60 transition-all duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">{trip.destination}</h3>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{trip.dates}</p>
                        <Badge variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{trip.type}</Badge>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60">
                          <span className="text-xs text-gray-400 dark:text-gray-500">{t('rating')}:</span>
                          <div className="text-sm">{renderStars(trip.rating)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ PROFILE TAB ═══ */}
          {activeTab === 'profile' && (
            <div>
              {/* Completeness indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('personalInfo')}</h2>
                  <div className="flex gap-2">
                    {isEditingProfile ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingProfile(false)}
                          className="gap-1.5 border-gray-200 dark:border-gray-600"
                        >
                          <X className="w-3.5 h-3.5" />
                          {t('cancel')}
                        </Button>
                        <Button
                          size="sm"
                          onClick={async () => {
                            setIsSavingProfile(true);
                            try {
                              const res = await fetch('/api/auth/me', {
                                method: 'PUT', credentials: 'include',
                                headers: { 'content-type': 'application/json' },
                                body: JSON.stringify({ user: profileData }),
                              });
                              if (!res.ok) throw new Error(t('profileSaveError') || 'Failed to save');
                              toast.success(t('profileSaved') || 'Profile saved');
                              setIsEditingProfile(false);
                            } catch (err) {
                              toast.error(err instanceof Error ? err.message : 'Failed to save');
                            } finally {
                              setIsSavingProfile(false);
                            }
                          }}
                          disabled={isSavingProfile || isLoadingProfile}
                          className="gap-1.5 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white"
                        >
                          {isSavingProfile ? (
                            <><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{t('saving')}</>
                          ) : (
                            <><Save className="w-3.5 h-3.5" />{t('saveProfile')}</>
                          )}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(true)}
                        className="gap-1.5 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        {t('editProfile')}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Completeness bar with aria-live for screen readers */}
                <div className="flex items-center gap-3" aria-live="polite" role="status">
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', completenessBarColor)}
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                  <span className={cn('text-sm font-semibold tabular-nums', completenessColor)}>{completeness}%</span>
                  {completeness < 100 && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                      {completeness >= 80 ? t('almostComplete') : t('completeYourProfile')}
                    </span>
                  )}
                  {completeness === 100 && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {t('complete')}
                    </span>
                  )}
                </div>
              </div>

              {isLoadingProfile ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      <div className={skeletonCls} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Section: Personal Info */}
                  <SectionCard icon={User} title={t('personalInfo')}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label={t('name')} icon={User} htmlFor="profile-name" required>
                        <Input
                          id="profile-name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          disabled={!isEditingProfile}
                          className="pl-9 text-sm h-10"
                        />
                      </FormField>
                      <FormField label={t('dateOfBirth')} icon={Calendar} htmlFor="profile-dob">
                        <Input
                          id="profile-dob"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                          disabled={!isEditingProfile}
                          className="pl-9 text-sm h-10"
                        />
                      </FormField>
                      <FormField label={t('nationality')} icon={Globe} htmlFor="profile-nationality">
                        <Input
                          id="profile-nationality"
                          value={profileData.nationality}
                          onChange={(e) => setProfileData({ ...profileData, nationality: e.target.value })}
                          disabled={!isEditingProfile}
                          className="pl-9 text-sm h-10"
                        />
                      </FormField>
                      <FormField label={t('address')} icon={MapPin} htmlFor="profile-address">
                        <Input
                          id="profile-address"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          disabled={!isEditingProfile}
                          className="pl-9 text-sm h-10"
                        />
                      </FormField>
                    </div>
                  </SectionCard>

                  {/* Section: Contact Details */}
                  <SectionCard icon={Mail} title={t('contactDetails')}>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label htmlFor="profile-email" className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                            {t('email')}<span className="text-red-500 dark:text-red-400 ml-0.5">*</span>
                          </label>
                          {emailVerified ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                              <BadgeCheck className="w-3.5 h-3.5" />{t('emailVerified')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                              <BadgeAlert className="w-3.5 h-3.5" />{t('emailUnverified')}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                          <Input
                            id="profile-email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            disabled={!isEditingProfile}
                            className={cn('pl-9 text-sm h-10', fieldErrors.email && 'border-red-400 dark:border-red-500')}
                          />
                        </div>
                        {fieldErrors.email && <p className="text-xs text-red-500 dark:text-red-400">{fieldErrors.email}</p>}
                        {!emailVerified && !isEditingProfile && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResendVerification}
                            disabled={isSendingVerification}
                            className="gap-1.5 text-xs text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/30 p-0 h-auto -mt-0.5"
                          >
                            {isSendingVerification ? (
                              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            ) : (
                              <Send className="w-3 h-3" />
                            )}{t('resendVerification')}
                          </Button>
                        )}
                      </div>
                      <FormField label={t('phone')} icon={Phone} htmlFor="profile-phone" error={fieldErrors.phone}>
                        <Input
                          id="profile-phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!isEditingProfile}
                          className={cn('pl-9 text-sm h-10', fieldErrors.phone && 'border-red-400 dark:border-red-500')}
                        />
                      </FormField>
                    </div>
                  </SectionCard>

                  {/* Section: Travel Documents */}
                  <SectionCard icon={CreditCard} title={t('travelDocuments')}>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <FormField label={t('passportNumber')} icon={CreditCard} htmlFor="profile-passport">
                        <Input
                          id="profile-passport"
                          value={profileData.passportNumber}
                          onChange={(e) => setProfileData({ ...profileData, passportNumber: e.target.value })}
                          disabled={!isEditingProfile}
                          className="pl-9 text-sm h-10"
                        />
                      </FormField>
                      <FormField label={t('nationalIdNumber')} icon={CreditCard} htmlFor="profile-national-id">
                        <Input
                          id="profile-national-id"
                          value={profileData.nationalIdNumber}
                          onChange={(e) => setProfileData({ ...profileData, nationalIdNumber: e.target.value })}
                          disabled={!isEditingProfile}
                          className="pl-9 text-sm h-10"
                        />
                      </FormField>
                      <FormField label={t('taxIdNumber')} icon={CreditCard} htmlFor="profile-tax-id">
                        <Input
                          id="profile-tax-id"
                          value={profileData.taxIdNumber}
                          onChange={(e) => setProfileData({ ...profileData, taxIdNumber: e.target.value })}
                          disabled={!isEditingProfile}
                          className="pl-9 text-sm h-10"
                        />
                      </FormField>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-1.5">
                      <Lock className="w-3 h-3" />
                      {t('documentsEncrypted')}
                    </p>
                  </SectionCard>

                  {/* Section: Security — Password */}
                  <SectionCard icon={Shield} title={t('security')}>
                    <div className="space-y-5">
                      {/* Password Change */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t('changePassword')}</h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label htmlFor="current-password" className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('currentPassword')}</label>
                            <div className="relative">
                              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input
                                id="current-password"
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.current}
                                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                placeholder={t('passwordPlaceholder')}
                                className="pl-9 pr-9 text-sm h-10"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                              >
                                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label htmlFor="new-password" className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('newPassword')}</label>
                            <div className="relative">
                              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input
                                id="new-password"
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.newPass}
                                onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                                placeholder={t('passwordMinChars')}
                                className="pl-9 text-sm h-10"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label htmlFor="confirm-password" className="block text-xs font-medium text-gray-500 dark:text-gray-400">{t('confirmNewPassword')}</label>
                            <div className="relative">
                              <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <Input
                                id="confirm-password"
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.confirm}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                placeholder={t('passwordReenter')}
                                className="pl-9 text-sm h-10"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button
                            size="sm"
                            onClick={handlePasswordChange}
                            disabled={isChangingPassword || !passwordData.current || !passwordData.newPass}
                            className="gap-1.5 bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white"
                          >
                            {isChangingPassword ? (
                              <><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{t('updating')}</>
                            ) : (
                              <><Lock className="w-3.5 h-3.5" />{t('changePassword')}</>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* 2FA Toggle */}
                      <div className="border-t border-gray-100 dark:border-gray-700/60 pt-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', twoFaEnabled ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-700')}>
                              <Smartphone className={cn('w-4.5 h-4.5', twoFaEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400')} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('twoFactorAuth')}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {twoFaEnabled ? t('twoFaEnabledStatus') : t('twoFaDisabledStatus')}
                              </p>
                            </div>
                          </div>
                          {twoFaEnabled ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowDisable2fa(!showDisable2fa)}
                              className="gap-1.5 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <X className="w-3.5 h-3.5" />{t('disable')}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleStart2faSetup}
                              disabled={isSettingUp2fa}
                              className="gap-1.5 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                            >
                              {isSettingUp2fa ? (
                                <><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>{t('loading')}</>
                              ) : (
                                <><Check className="w-3.5 h-3.5" />{t('enable')}</>
                              )}
                            </Button>
                          )}
                        </div>

                        {/* 2FA Setup Panel */}
                        {!twoFaEnabled && twoFaSetupData && (
                          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
                            <p className="text-xs text-gray-600 dark:text-gray-300">{t('twoFaSetupInstructions')}</p>
                            <div className="flex items-center gap-2">
                              <QrCode className="w-4 h-4 text-gray-500" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">{t('twoFaManualEntry')}:</span>
                              <code className="text-xs font-mono bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white select-all">{twoFaSetupData.secret}</code>
                              <button
                                type="button"
                                onClick={() => { navigator.clipboard.writeText(twoFaSetupData.secret); toast.success(t('copied')); }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                aria-label={t('copySecret')}
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={twoFaCode}
                                onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder={t('twoFaEnterCode')}
                                className="text-sm h-9 max-w-[180px] font-mono tracking-widest"
                                maxLength={6}
                              />
                              <Button
                                size="sm"
                                onClick={handleEnable2fa}
                                disabled={isVerifying2fa || twoFaCode.length !== 6}
                                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                {isVerifying2fa ? (
                                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}{t('verify')}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* 2FA Backup Codes (shown after enable) */}
                        {twoFaEnabled && twoFaBackupCodes.length > 0 && (
                          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800 space-y-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">{t('twoFaBackupCodesTitle')}</p>
                            </div>
                            <p className="text-xs text-amber-600 dark:text-amber-400">{t('twoFaBackupCodesWarning')}</p>
                            <div className="grid grid-cols-4 gap-2">
                              {twoFaBackupCodes.map((code) => (
                                <code key={code} className="text-xs font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border border-amber-200 dark:border-amber-700 text-center text-gray-900 dark:text-white">{code}</code>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 2FA Disable Panel */}
                        {twoFaEnabled && showDisable2fa && (
                          <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800 space-y-3">
                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{t('twoFaDisableWarning')}</p>
                            <div className="flex gap-2">
                              <Input
                                type="password"
                                value={disable2faPassword}
                                onChange={(e) => setDisable2faPassword(e.target.value)}
                                placeholder={t('currentPassword')}
                                className="text-sm h-9 max-w-[240px]"
                              />
                              <Button
                                size="sm"
                                onClick={handleDisable2fa}
                                disabled={isDisabling2fa || !disable2faPassword}
                                className="gap-1.5 bg-red-600 hover:bg-red-700 text-white"
                              >
                                {isDisabling2fa ? (
                                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                ) : (
                                  <X className="w-3.5 h-3.5" />
                                )}{t('disable')}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Active Sessions */}
                      <div className="border-t border-gray-100 dark:border-gray-700/60 pt-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('activeSessions')}</h4>
                          {sessions.length > 1 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleRevokeAllSessions}
                              className="gap-1.5 text-xs border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                              <LogOut className="w-3 h-3" />{t('revokeAllSessions')}
                            </Button>
                          )}
                        </div>
                        {isLoadingSessions ? (
                          <div className="space-y-2">
                            {Array.from({ length: 2 }).map((_, i) => (
                              <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse" />
                            ))}
                          </div>
                        ) : sessions.length === 0 ? (
                          <p className="text-xs text-gray-400 dark:text-gray-500">{t('noActiveSessions')}</p>
                        ) : (
                          <div className="space-y-2">
                            {sessions.map((s) => {
                              const DeviceIcon = getDeviceIcon(s.device);
                              return (
                                <div
                                  key={s.id}
                                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                      <DeviceIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {getDeviceLabel(s.device)}
                                        {s.isCurrent && (
                                          <Badge className="ml-2 text-[10px] px-1.5 py-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">{t('currentSession')}</Badge>
                                        )}
                                      </p>
                                      <p className="text-xs text-gray-400 dark:text-gray-500">
                                        {s.ipAddress ?? t('unknownIp')} · {new Date(s.lastUsedAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  {!s.isCurrent && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRevokeSession(s.id)}
                                      disabled={isRevokingSession === s.id}
                                      className="gap-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex-shrink-0"
                                    >
                                      {isRevokingSession === s.id ? (
                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                      ) : (
                                        <LogOut className="w-3 h-3" />
                                      )}{t('revoke')}
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </SectionCard>
                </div>
              )}
            </div>
          )}

          {/* ═══ PREFERENCES TAB ═══ */}
          {activeTab === 'preferences' && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('travelPreferences')}</h2>
                <Button
                  onClick={() => (window.location.href = '/preferences/edit')}
                  className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 text-white gap-2"
                  size="sm"
                >
                  <Edit className="w-4 h-4" />
                  {t('editProfile')}
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Briefcase, title: t('budgetRange'), content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : savedPreferences?.budgetRange ? (
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {savedPreferences.currency ?? 'USD'} {savedPreferences.budgetRange[0]?.toLocaleString?.()} – {savedPreferences.currency ?? 'USD'} {savedPreferences.budgetRange[1]?.toLocaleString?.()}
                    </span>
                  ) : <span className="text-sm text-gray-400">{t('notSet')}</span> },
                  { icon: MapPin, title: t('preferredDestinations'), content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.preferredDestinations?.length ?? 0) > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {savedPreferences!.preferredDestinations!.slice(0, 6).map((d) => (
                        <Badge key={d} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{d}</Badge>
                      ))}
                    </div>
                  ) : <span className="text-sm text-gray-400">{t('notSet')}</span> },
                  { icon: TreePalm, title: t('travelStyle'), content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.travelStyles?.length ?? 0) > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {savedPreferences!.travelStyles!.slice(0, 6).map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{s}</Badge>
                      ))}
                    </div>
                  ) : <span className="text-sm text-gray-400">{t('notSet')}</span> },
                  { icon: Hotel, title: t('accommodation'), content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.accommodationType?.length ?? 0) > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {savedPreferences!.accommodationType!.slice(0, 6).map((a) => (
                        <Badge key={a} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{hbAccommodationLabels[a] ?? a}</Badge>
                      ))}
                    </div>
                  ) : <span className="text-sm text-gray-400">{t('notSet')}</span> },
                  { icon: Heart, title: t('activities'), content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.activityTypes?.length ?? 0) > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {savedPreferences!.activityTypes!.slice(0, 6).map((a) => (
                        <Badge key={a} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{a}</Badge>
                      ))}
                    </div>
                  ) : <span className="text-sm text-gray-400">{t('notSet')}</span> },
                  { icon: Utensils, title: t('dietary'), content: isLoadingPreferences ? <Badge variant="outline">{t('loadingPrefs')}</Badge> : (savedPreferences?.dietaryRestrictions?.length ?? 0) > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {savedPreferences!.dietaryRestrictions!.slice(0, 6).map((d) => (
                        <Badge key={d} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0">{d}</Badge>
                      ))}
                    </div>
                  ) : <span className="text-sm text-gray-400">{t('notSet')}</span> },
                ].map(({ icon: Icon, title, content }, i) => (
                  <SectionCard key={i} icon={Icon} title={title}>
                    {content}
                  </SectionCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
