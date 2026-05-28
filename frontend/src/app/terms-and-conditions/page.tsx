import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { Card } from "@/components/ui/Card";

export default function TermsAndConditionsPage() {
  return (
    <StorefrontShell>
      <div className="page-container">
        <section className="page-section">
          <Card style={{ padding: "1.25rem" }}>
            <p className="eyebrow">Legal</p>
            <h1 className="display-heading" style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
              Terms and Conditions
            </h1>
            <div className="stack" style={{ gap: "0.9rem" }}>
              <p>
                By purchasing from this storefront, you receive a license to use the
                downloaded digital assets according to the product terms described at
                checkout and inside the files.
              </p>
              <p>
                All files remain protected digital goods. Redistribution, resale,
                or unauthorized public sharing is not permitted without written
                permission.
              </p>
              <p>
                Refunds, delivery access, and account eligibility should be managed
                according to your payment provider, order verification, and download
                protection policies.
              </p>
            </div>
          </Card>
        </section>
      </div>
    </StorefrontShell>
  );
}
