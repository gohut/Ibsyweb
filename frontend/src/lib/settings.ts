export type WebsiteSettings = {
  siteName: string;
  tagline: string;
  logoUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  termsUrl: string;
  copyrightName: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontPair: string;
};

export type AdminSettings = {
  username: string;
  password: string;
  contactEmail: string;
};

export type SliderSetting = {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  productSlug?: string;
};

export type AppSettings = {
  website: WebsiteSettings;
  admin: AdminSettings;
  slider: SliderSetting[];
};

export const fallbackSettings: AppSettings = {
  website: {
    siteName: "Royal Vault",
    tagline: "Premium digital assets for founders, creators, and modern studios.",
    logoUrl: "/brand-logo.svg",
    instagramHandle: "@royalvault",
    instagramUrl: "https://instagram.com/royalvault",
    termsUrl: "/terms-and-conditions",
    copyrightName: "Royal Vault",
    accentColor: "#C9A84C",
    backgroundColor: "#1A1A2E",
    textColor: "#F5F0E8",
    fontPair: "Playfair Display + DM Sans",
  },
  admin: {
    username: "admin",
    password: "super-secret",
    contactEmail: "support@royalvault.example",
  },
  slider: [
    {
      id: "slide-1",
      imageUrl: "/brand-logo.svg",
      title: "Digital products with a luxury storefront feel",
      subtitle: "Templates, UI kits, strategy decks, and polished resource bundles.",
      productSlug: "creator-launch-blueprint",
    },
  ],
};

export function mergeSettings(settings?: Partial<AppSettings>): AppSettings {
  return {
    website: {
      ...fallbackSettings.website,
      ...settings?.website,
    },
    admin: {
      ...fallbackSettings.admin,
      ...settings?.admin,
    },
    slider:
      settings?.slider && settings.slider.length
        ? settings.slider.map((slide, index) => ({
            ...fallbackSettings.slider[0],
            ...slide,
            id: slide.id || `slide-${index + 1}`,
          }))
        : fallbackSettings.slider,
  };
}
