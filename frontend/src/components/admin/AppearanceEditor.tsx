"use client";

import Image from "next/image";
import { useState } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { appearanceFonts } from "@/lib/mock-data";

type ThemeColorKey = "accentColor" | "backgroundColor" | "textColor";

type ThemeColorFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function normalizeHex(value: string) {
  const nextValue = value.trim().toUpperCase();

  if (!nextValue.startsWith("#")) {
    return `#${nextValue}`;
  }

  return nextValue;
}

function ThemeColorField({ label, value, onChange }: ThemeColorFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <div
        className="surface-card"
        style={{
          padding: "0.75rem",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "0.75rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            border: "1px solid var(--color-border)",
            background: value,
            boxShadow: "var(--shadow-edge)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <input
            aria-label={`${label} picker`}
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
            }}
          />
        </div>
        <div className="stack" style={{ gap: "0.5rem" }}>
          <input
            className="royal-input"
            value={value}
            onChange={(event) => onChange(normalizeHex(event.target.value))}
            placeholder="#C9A84C"
            spellCheck={false}
          />
          <span className="muted">
            Current value: <strong style={{ color: "var(--color-text-primary)" }}>{value}</strong>
          </span>
        </div>
      </div>
    </label>
  );
}

export function AppearanceEditor() {
  const { showToast } = useAppState();
  const { settings, setSettings } = useSettings();
  const [logoPreview, setLogoPreview] = useState(settings.website.logoUrl);
  const [theme, setTheme] = useState({
    accentColor: settings.website.accentColor.toUpperCase(),
    backgroundColor: settings.website.backgroundColor.toUpperCase(),
    textColor: settings.website.textColor.toUpperCase(),
    fontPair: settings.website.fontPair,
  });

  const setThemeColor =
    (key: ThemeColorKey) =>
    (value: string) => {
      setTheme((current) => ({
        ...current,
        [key]: value,
      }));
    };

  return (
    <div className="stack">
      <div className="two-column">
        <Card style={{ padding: "1rem" }}>
          <div className="form-grid">
            <ThemeColorField
              label="Primary Accent Color"
              value={theme.accentColor}
              onChange={setThemeColor("accentColor")}
            />
            <ThemeColorField
              label="Background Color"
              value={theme.backgroundColor}
              onChange={setThemeColor("backgroundColor")}
            />
            <ThemeColorField
              label="Text Color"
              value={theme.textColor}
              onChange={setThemeColor("textColor")}
            />
            <label className="field">
              <span>Font Pair</span>
              <select
                className="royal-input"
                value={theme.fontPair}
                onChange={(event) =>
                  setTheme((current) => ({
                    ...current,
                    fontPair: event.target.value,
                  }))
                }
              >
                {appearanceFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </label>
            <Card style={{ padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span
                  className="logo-mark"
                  style={{ borderColor: theme.accentColor }}
                >
                  <Image
                    src={logoPreview}
                    alt={settings.website.siteName}
                    width={56}
                    height={56}
                    unoptimized
                  />
                </span>
                <div>
                  <strong>Logo Upload</strong>
                  <p className="muted">Upload a logo and save it into settings.json.</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ marginTop: "0.6rem" }}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }

                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = reader.result;
                        if (typeof result === "string") {
                          setLogoPreview(result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>
            </Card>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={async () => {
                  const nextSettings = {
                    ...settings,
                    website: {
                      ...settings.website,
                      logoUrl: logoPreview,
                      accentColor: theme.accentColor,
                      backgroundColor: theme.backgroundColor,
                      textColor: theme.textColor,
                      fontPair: theme.fontPair,
                    },
                  };

                  const response = await fetch("/api/settings", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(nextSettings),
                  });
                  const savedSettings = (await response.json()) as typeof nextSettings;
                  setSettings(savedSettings);
                  showToast("Appearance settings saved.");
                }}
              >
                Save Appearance
              </Button>
            </div>
          </div>
        </Card>

        <Card style={{ padding: "1rem" }}>
          <p className="eyebrow" style={{ color: theme.accentColor }}>
            Live preview
          </p>
          <div
            className="surface-card"
            style={{
              padding: "1rem",
              marginTop: "0.8rem",
              background: theme.backgroundColor,
              color: theme.textColor,
              borderColor: theme.accentColor,
              boxShadow: `0 0 0 1px ${theme.accentColor}33`,
            }}
          >
            <p className="eyebrow" style={{ color: theme.accentColor }}>
              Royal preview
            </p>
            <h3 className="display-heading" style={{ fontSize: "1.8rem" }}>
              {settings.website.siteName}
            </h3>
            <p style={{ color: `${theme.textColor}B3` }}>{settings.website.tagline}</p>
            <div
              className="surface-card"
              style={{
                padding: "1rem",
                marginTop: "1rem",
                borderColor: theme.accentColor,
                boxShadow: `0 0 0 1px ${theme.accentColor}33`,
                background: `${theme.backgroundColor}CC`,
              }}
            >
              <p style={{ color: theme.accentColor }}>Accent glow</p>
              <p>Refined premium interface direction with dark navy depth.</p>
            </div>
            <div
              className="stack"
              style={{
                gap: "0.45rem",
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: `1px solid ${theme.accentColor}33`,
              }}
            >
              <span className="muted" style={{ color: `${theme.textColor}B3` }}>
                Selected colors
              </span>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {[
                  { label: "Accent", value: theme.accentColor },
                  { label: "Background", value: theme.backgroundColor },
                  { label: "Text", value: theme.textColor },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="pill"
                    style={{
                      borderColor: theme.accentColor,
                      color: theme.textColor,
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: item.value,
                        border: `1px solid ${theme.accentColor}55`,
                      }}
                    />
                    {item.label}: {item.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
