import { fallbackSettings, mergeSettings, type AppSettings } from "@/lib/settings";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/types/supabase";

type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
type SiteSettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];
type SliderRow = Database["public"]["Tables"]["slider_images"]["Row"];

type SettingsClient = {
  from(table: "site_settings"): {
    select(cols: string): {
      single(): Promise<{ data: SiteSettingsRow | null; error: { message: string } | null }>;
    };
    update(values: SiteSettingsUpdate): {
      eq(col: string, val: string): Promise<{ error: { message: string } | null }>;
    };
  };
  from(table: "slider_images"): {
    select(cols: string): {
      order(col: string): Promise<{ data: SliderRow[] | null; error: { message: string } | null }>;
    };
  };
};

export async function readAppSettings(): Promise<AppSettings> {
  try {
    const supabase = createSupabaseServerClient() as unknown as SettingsClient;

    const [{ data: s, error: sErr }, { data: slides, error: slidesErr }] =
      await Promise.all([
        supabase.from("site_settings").select("*").single(),
        supabase.from("slider_images").select("*").order("sort_order"),
      ]);

    if (sErr) console.error("[readAppSettings] site_settings error:", sErr.message);
    if (slidesErr) console.error("[readAppSettings] slider_images error:", slidesErr.message);

    if (!s) return fallbackSettings;

    return mergeSettings({
      website: {
        siteName: s.site_name,
        tagline: s.tagline,
        logoUrl: s.logo_url,
        instagramHandle: s.instagram_handle ?? "",
        instagramUrl: s.instagram_url ?? "",
        termsUrl: s.terms_url ?? "",
        copyrightName: s.copyright_name ?? "",
        accentColor: s.accent_color,
        backgroundColor: s.background_color,
        textColor: s.text_color,
        fontPair: s.font_pair,
      },
      admin: {
        username: s.admin_username,
        password: s.admin_password,
        contactEmail: s.contact_email,
      },
      // Always pass the array (even if empty) so mergeSettings knows the DB
      // was reached and won't inject the hardcoded fallback slide.
      slider: (slides ?? []).map((slide) => ({
        id: slide.id,
        imageUrl: slide.image_url ?? "",
        title: slide.title ?? "",
        subtitle: slide.subtitle ?? "",
        productSlug: slide.product_slug ?? "",
      })),
    });
  } catch (err) {
    console.error("[readAppSettings] unexpected error:", err);
    return fallbackSettings;
  }
}

export async function writeAppSettings(settings: AppSettings) {
  const safeSettings = mergeSettings(settings);
  const supabase = createSupabaseServerClient() as unknown as SettingsClient;

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .single();

  if (existing?.id) {
    await supabase
      .from("site_settings")
      .update({
        site_name: safeSettings.website.siteName,
        tagline: safeSettings.website.tagline,
        logo_url: safeSettings.website.logoUrl,
        instagram_handle: safeSettings.website.instagramHandle,
        instagram_url: safeSettings.website.instagramUrl,
        terms_url: safeSettings.website.termsUrl,
        copyright_name: safeSettings.website.copyrightName,
        accent_color: safeSettings.website.accentColor,
        background_color: safeSettings.website.backgroundColor,
        text_color: safeSettings.website.textColor,
        font_pair: safeSettings.website.fontPair,
        admin_username: safeSettings.admin.username,
        admin_password: safeSettings.admin.password,
        contact_email: safeSettings.admin.contactEmail,
      })
      .eq("id", existing.id);
  }

  return safeSettings;
}