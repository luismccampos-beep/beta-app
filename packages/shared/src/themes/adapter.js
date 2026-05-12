import { createTheme } from './createTheme';
export function adaptLegacyTheme(name, legacy) {
    // Mapeamento básico do legacy -> Palette moderna
    const palette = {
        primary: legacy.primaryColor,
        primaryForeground: '#ffffff',
        background: '#ffffff',
        foreground: legacy.secondaryColor ?? '#0f172a',
        muted: '#f1f5f9',
        mutedForeground: '#475569',
        border: '#e2e8f0',
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
    };
    return createTheme({ name, palette: palette });
}
//# sourceMappingURL=adapter.js.map