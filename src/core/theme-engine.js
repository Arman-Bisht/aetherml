/**
 * AetherML Theme Engine
 * Generates dynamic design tokens, CSS custom properties, and Tailwind configurations.
 */

export const THEME_PRESETS = {
  midnight: {
    name: 'Midnight Indigo',
    background: '#0b0f19',
    foreground: '#f8fafc',
    primary: '#3b82f6',
    primaryFg: '#ffffff',
    card: '#131b2e',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    accent: '#06b6d4',
    radius: '1rem'
  },
  cyberpunk: {
    name: 'Cyberpunk Neon',
    background: '#050508',
    foreground: '#f8fafc',
    primary: '#f43f5e',
    primaryFg: '#ffffff',
    card: '#0e0e17',
    cardBorder: 'rgba(244, 63, 94, 0.25)',
    accent: '#eab308',
    radius: '0.25rem'
  },
  minimal: {
    name: 'Monochrome Minimal',
    background: '#09090b',
    foreground: '#fafafa',
    primary: '#ffffff',
    primaryFg: '#000000',
    card: '#18181b',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    accent: '#a1a1aa',
    radius: '0.375rem'
  },
  corporate: {
    name: 'Corporate Royal',
    background: '#0f172a',
    foreground: '#f1f5f9',
    primary: '#2563eb',
    primaryFg: '#ffffff',
    card: '#1e293b',
    cardBorder: 'rgba(148, 163, 184, 0.15)',
    accent: '#38bdf8',
    radius: '0.5rem'
  },
  emerald: {
    name: 'Emerald Matrix',
    background: '#04120e',
    foreground: '#ecfdf5',
    primary: '#10b981',
    primaryFg: '#ffffff',
    card: '#06281e',
    cardBorder: 'rgba(16, 185, 129, 0.2)',
    accent: '#34d399',
    radius: '0.75rem'
  }
};

/**
 * Resolves theme configuration from AST properties
 * @param {string} themeName - Preset name (midnight, cyberpunk, etc.)
 * @param {Object} overrides - Custom prop overrides (primary, radius, etc.)
 */
export function resolveTheme(themeName = 'midnight', overrides = {}) {
  const normalized = (themeName || 'midnight').toLowerCase().trim();
  const base = THEME_PRESETS[normalized] || THEME_PRESETS.midnight;

  return {
    ...base,
    primary: overrides.primary || base.primary,
    accent: overrides.accent || base.accent,
    radius: overrides.radius || base.radius,
    background: overrides.background || base.background,
    card: overrides.card || base.card
  };
}

/**
 * Generates CSS Variables string for injection into globals.css
 */
export function generateThemeCssVariables(themeConfig) {
  return `
:root {
  --background: ${themeConfig.background};
  --foreground: ${themeConfig.foreground};
  --primary: ${themeConfig.primary};
  --primary-foreground: ${themeConfig.primaryFg};
  --card: ${themeConfig.card};
  --card-border: ${themeConfig.cardBorder};
  --accent: ${themeConfig.accent};
  --radius: ${themeConfig.radius};
}
  `.trim();
}
