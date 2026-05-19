/**
 * src/constants/colors.ts
 * 
 * Official design system color palette unified with web frontend.
 * Extracted from frontend/tailwind.config.js to ensure 1:1 parity across platforms.
 */

export const COLORS = {
  // Primary Brand Colors (from tailwind.config.js)
  ustpDarkBlue: '#0f2460',    // Main brand dark
  ustpBlue: '#1a3a8f',        // Primary brand blue
  ustpGold: '#f0b429',        // Gold accent

  // Supporting Brand Variants
  ustpBlueLight: '#2a52cc',   // Lighter variant for hover states
  ustpGoldDark: '#c8941f',    // Darker gold for emphasis
  ustpGoldLight: '#fff8e6',   // Light gold background

  // Status & Semantic Colors
  emerald: '#10b981',         // Success / Enrolled
  emeraldBg: '#d1fae5',       // Light emerald background
  purple: '#8b5cf6',          // Processing / Assessed
  purpleBg: '#ede9fe',        // Light purple background
  red: '#ef4444',             // Error / Failed
  redBg: '#fee2e2',           // Light red background

  // Neutral Grays (from tailwind theme)
  g50: '#f8f9fb',             // Lightest background
  g100: '#f0f2f7',            // Light background
  g200: '#e2e6ef',            // Border gray
  grayBg: '#f3f4f6',          // Card background
  blueBg: '#eff6ff',          // Blue tint background
  border: '#e5e7eb',          // Standard border color

  // Text Colors
  textMain: '#1f2937',        // Primary text (dark gray-800)
  textMuted: '#6b7280',       // Secondary text (gray-500)
  textLight: '#9ca3af',       // Tertiary text (gray-400)

  // White / Black
  white: '#ffffff',
  black: '#000000',
};

// Alias export for compatibility
export const Colors = COLORS;
export default COLORS;