"use client";

import { useState } from "react";
import { useAppState } from "@/components/providers/AppStateProvider";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function AdminSettingsPage() {
  const { settings, setSettings } = useSettings();
  const { showToast } = useAppState();
  const [formState, setFormState] = useState({
    username: settings.admin.username,
    password: settings.admin.password,
    siteName: settings.website.siteName,
    tagline: settings.website.tagline,
    instagramHandle: settings.website.instagramHandle,
    instagramUrl: settings.website.instagramUrl,
    termsUrl: settings.website.termsUrl,
    contactEmail: settings.admin.contactEmail,
    copyrightName: settings.website.copyrightName,
  });

  return (
    <div className="stack">
      <SectionHeading title="Settings" eyebrow="Site controls" />
      <Card style={{ padding: "1rem" }}>
        <div className="form-grid">
          <Input
            label="Admin Username"
            value={formState.username}
            onChange={(event) =>
              setFormState((current) => ({ ...current, username: event.target.value }))
            }
          />
          <Input
            label="Admin Password"
            type="password"
            value={formState.password}
            onChange={(event) =>
              setFormState((current) => ({ ...current, password: event.target.value }))
            }
          />
          <Input
            label="Site Name"
            value={formState.siteName}
            onChange={(event) =>
              setFormState((current) => ({ ...current, siteName: event.target.value }))
            }
          />
          <Input
            label="Tagline"
            value={formState.tagline}
            onChange={(event) =>
              setFormState((current) => ({ ...current, tagline: event.target.value }))
            }
          />
          <Input
            label="Instagram Handle"
            value={formState.instagramHandle}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                instagramHandle: event.target.value,
              }))
            }
          />
          <Input
            label="Instagram URL"
            value={formState.instagramUrl}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                instagramUrl: event.target.value,
              }))
            }
          />
          <Input
            label="Contact Email"
            value={formState.contactEmail}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                contactEmail: event.target.value,
              }))
            }
          />
          <Input
            label="Terms URL"
            value={formState.termsUrl}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                termsUrl: event.target.value,
              }))
            }
          />
          <Input
            label="Copyright Name"
            value={formState.copyrightName}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                copyrightName: event.target.value,
              }))
            }
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={async () => {
                const nextSettings = {
                  ...settings,
                  website: {
                    ...settings.website,
                    siteName: formState.siteName,
                    tagline: formState.tagline,
                    instagramHandle: formState.instagramHandle,
                    instagramUrl: formState.instagramUrl,
                    termsUrl: formState.termsUrl,
                    copyrightName: formState.copyrightName,
                  },
                  admin: {
                    ...settings.admin,
                    username: formState.username,
                    password: formState.password,
                    contactEmail: formState.contactEmail,
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
                showToast("Admin and website settings saved.");
              }}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
