import type { CSSProperties } from "react";
import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Playfair_Display,
} from "next/font/google";
import { AppStateProvider } from "@/components/providers/AppStateProvider";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { readAppSettings } from "@/lib/settings.server";
import { deriveThemeVariables } from "@/lib/theme";
import "./globals.css";

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const accentFont = Cormorant_Garamond({
  variable: "--font-accent",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await readAppSettings();

  return {
    title: settings.website.siteName,
    description: settings.website.tagline,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await readAppSettings();
  const themeVariables = deriveThemeVariables(settings.website) as CSSProperties;

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${accentFont.variable}`}
    >
      <body style={themeVariables}>
        <SettingsProvider initialSettings={settings}>
          <AppStateProvider>{children}</AppStateProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
