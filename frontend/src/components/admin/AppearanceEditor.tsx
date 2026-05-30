"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { appearanceFonts } from "@/lib/mock-data";

type ThemeColorKey = "accentColor" | "backgroundColor" | "textColor";

type ThemeColorFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function normalizeHex(value: string) {
  const nextValue = value.trim().toUpperCase();
  return nextValue.startsWith("#") ? nextValue : `#${nextValue}`;
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
            onChange={(e) => onChange(e.target.value.toUpperCase())}
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
            onChange={(e) => onChange(normalizeHex(e.target.value))}
            placeholder="#C9A84C"
            spellCheck={false}
          />
          <span className="muted">
            Current:{" "}
            <strong style={{ color: "var(--color-text-primary)" }}>{value}</strong>
          </span>
        </div>
      </div>
    </label>
  );
}

export function AppearanceEditor() {
  const { showToast } = useAppState();
  const { settings, setSettings } = useSettings();

  const [logoUrl, setLogoUrl] = useState(settings.website.logoUrl ?? "");
  const [theme, setTheme] = useState({
    accentColor: settings.website.accentColor.toUpperCase(),
    backgroundColor: settings.website.backgroundColor.toUpperCase(),
    textColor: settings.website.textColor.toUpperCase(),
    fontPair: settings.website.fontPair,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings(data);
        setLogoUrl(data.website.logoUrl ?? "");
        setTheme({
          accentColor: data.website.accentColor.toUpperCase(),
          backgroundColor: data.website.backgroundColor.toUpperCase(),
          textColor: data.website.textColor.toUpperCase(),
          fontPair: data.website.fontPair,
        });
      } catch {
        showToast("Error loading appearance settings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [setSettings, showToast]);

  const setThemeColor = (key: ThemeColorKey) => (value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const nextSettings = {
      ...settings,
      website: {
        ...settings.website,
        logoUrl,
        accentColor: theme.accentColor,
        backgroundColor: theme.backgroundColor,
        textColor: theme.textColor,
        fontPair: theme.fontPair,
      },
    };

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextSettings),
      });

      if (!res.ok) throw new Error("Failed to save");

      const saved = await res.json();
      setSettings(saved);
      showToast("Appearance settings saved successfully.");
    } catch {
      showToast("Error saving appearance settings.", "error");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading appearance settings...
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="two-column">

        {/* ── Left: Controls ── */}
        <Card style={{ padding: "1rem" }}>
          <div className="form-grid">

            {/* Colors */}
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

            {/* Font */}
            <label className="field">
              <span>Font Pair</span>
              <select
                className="royal-input"
                value={theme.fontPair}
                onChange={(e) =>
                  setTheme((prev) => ({ ...prev, fontPair: e.target.value }))
                }
              >
                {appearanceFonts.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </label>

            {/* ── Logo URL (replaces file upload) ── */}
            <Card style={{ padding: "1rem" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}
              >
                {/* Live logo preview */}
                <div
                  className="logo-mark"
                  style={{
                    borderColor: theme.accentColor,
                    flexShrink: 0,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `2px solid ${theme.accentColor}`,
                    background: "var(--color-bg-tertiary)",
                    position: "relative",
                  }}
                >
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt="Logo preview"
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized
                      onError={() => {}} // silently fail on bad URL
                    />
                  ) : (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        color: theme.accentColor,
                        fontSize: "1.4rem",
                      }}
                    >
                      ✦
                    </span>
                  )}
                </div>
                <div>
                  <strong>Site Logo</strong>
                  <p className="muted" style={{ fontSize: "0.82rem" }}>
                    Upload your logo to Cloudflare R2, then paste the public URL below.
                  </p>
                </div>
              </div>

              <Input
                label="Logo URL"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://your-r2-bucket.r2.dev/logo.png"
                hint="Must be a publicly accessible image URL."
              />
            </Card>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleSave}>Save Appearance</Button>
            </div>
          </div>
        </Card>

        {/* ── Right: Live Preview ── */}
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
            <p style={{ color: `${theme.textColor}B3` }}>
              {settings.website.tagline}
            </p>
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
              <p>Refined premium interface with dark navy depth.</p>
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
                    style={{ borderColor: theme.accentColor, color: theme.textColor }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: item.value,
                        border: `1px solid ${theme.accentColor}55`,
                        display: "inline-block",
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