import { AppearanceEditor } from "@/components/admin/AppearanceEditor";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function AdminAppearancePage() {
  return (
    <div className="stack">
      <SectionHeading title="Appearance" eyebrow="Theme and logo" />
      <AppearanceEditor />
    </div>
  );
}
