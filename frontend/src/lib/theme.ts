import type { WebsiteSettings } from "@/lib/settings";

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function normalizeHex(hex: string) {
  const value = hex.trim();
  return value.startsWith("#") ? value : `#${value}`;
}

function hexToRgb(hex: string) {
  const value = normalizeHex(hex).replace("#", "");
  const expanded =
    value.length === 3
      ? value
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : value;

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mix(hexA: string, hexB: string, weight: number) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);

  return rgbToHex(
    a.r + (b.r - a.r) * weight,
    a.g + (b.g - a.g) * weight,
    a.b + (b.b - a.b) * weight,
  );
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function deriveThemeVariables(website: WebsiteSettings) {
  const accent = normalizeHex(website.accentColor);
  const background = normalizeHex(website.backgroundColor);
  const text = normalizeHex(website.textColor);
  const bgSecondary = mix(background, "#FFFFFF", 0.08);
  const bgTertiary = mix(background, "#2B5A93", 0.24);

  return {
    "--color-bg-primary": background,
    "--color-bg-secondary": bgSecondary,
    "--color-bg-tertiary": bgTertiary,
    "--color-accent-primary": accent,
    "--color-accent-secondary": mix(accent, "#FFFFFF", 0.26),
    "--color-accent-glow": rgba(accent, 0.18),
    "--color-text-primary": text,
    "--color-text-secondary": rgba(text, 0.72),
    "--color-text-muted": rgba(text, 0.46),
    "--color-border": rgba(accent, 0.24),
    "--color-card-bg": rgba(bgSecondary, 0.86),
    "--color-overlay": rgba(background, 0.76),
    "--color-accent-faint": rgba(accent, 0.08),
    "--color-accent-soft": rgba(accent, 0.12),
    "--color-accent-medium": rgba(accent, 0.14),
    "--color-accent-strong": rgba(accent, 0.16),
    "--color-accent-border-strong": rgba(accent, 0.5),
    "--color-bg-primary-soft": rgba(background, 0.92),
    "--color-bg-secondary-soft": rgba(bgSecondary, 0.92),
    "--color-bg-secondary-strong": rgba(bgSecondary, 0.94),
    "--color-bg-secondary-solid": rgba(bgSecondary, 0.96),
    "--color-bg-secondary-card": rgba(bgSecondary, 0.82),
    "--color-bg-tertiary-soft": rgba(bgTertiary, 0.3),
    "--color-bg-tertiary-medium": rgba(bgTertiary, 0.45),
    "--color-bg-tertiary-strong": rgba(bgTertiary, 0.48),
    "--color-bg-tertiary-glass": rgba(bgTertiary, 0.6),
    "--color-bg-tertiary-card": rgba(bgTertiary, 0.82),
    "--color-surface-soft": "rgba(255, 255, 255, 0.03)",
    "--color-surface-medium": "rgba(255, 255, 255, 0.05)",
    "--color-surface-strong": "rgba(255, 255, 255, 0.08)",
    "--color-surface-track": "rgba(255, 255, 255, 0.1)",
    "--color-text-primary-soft": rgba(text, 0.32),
    "--color-text-primary-medium": rgba(text, 0.6),
    "--color-text-primary-strong": rgba(text, 0.8),
    "--color-slide-overlay": rgba(background, 0.88),
  };
}
