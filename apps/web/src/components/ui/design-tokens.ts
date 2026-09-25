/**
 * 2BeCollab Design Tokens
 * Reusable design constants to ensure visual consistency across the app.
 * Other developers can import these tokens directly when creating custom components.
 */

export const colors = {
  brand: {
    primary: '#6366f1', // Indigo
    primaryHover: '#4f46e5',
    primaryLight: '#818cf8',
    primaryDark: '#3730a3',
    primaryGlow: 'rgba(99, 102, 241, 0.4)',

    secondary: '#06b6d4', // Cyber Cyan
    secondaryHover: '#0891b2',
    secondaryLight: '#22d3ee',
    secondaryDark: '#0e7490',
    secondaryGlow: 'rgba(6, 182, 212, 0.4)',

    accent: '#f59e0b', // Warm Amber
    accentHover: '#d97706',
    accentLight: '#fbbf24',
  },
  semantic: {
    success: '#10b981',
    successBg: 'rgba(16, 185, 129, 0.12)',
    warning: '#f59e0b',
    warningBg: 'rgba(245, 158, 11, 0.12)',
    error: '#ef4444',
    errorBg: 'rgba(239, 68, 68, 0.12)',
    info: '#3b82f6',
    infoBg: 'rgba(59, 130, 246, 0.12)',
  },
  dark: {
    bgPrimary: '#0a0a16',
    bgSecondary: '#121324',
    bgTertiary: '#191a32',
    bgCard: 'rgba(26, 27, 46, 0.75)',
    bgCardHover: 'rgba(35, 36, 62, 0.85)',
    bgElevated: '#232442',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    border: 'rgba(148, 163, 184, 0.15)',
    borderLight: 'rgba(148, 163, 184, 0.08)',
  },
} as const;

export const gradients = {
  primary: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  cyber: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
  accent: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  cardMesh: 'radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
  textHero: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #22d3ee 100%)',
  textWarm: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #ec4899 100%)',
} as const;

export const shadows = {
  glowPrimary: '0 0 25px rgba(99, 102, 241, 0.25)',
  glowCyan: '0 0 25px rgba(6, 182, 212, 0.25)',
  glowAmber: '0 0 25px rgba(245, 158, 11, 0.25)',
  card: '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
  cardHover: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.15)',
} as const;
