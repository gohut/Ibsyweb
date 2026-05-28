"use client";

import Image from "next/image";
import Link from "next/link";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const {
    settings: { website },
  } = useSettings();

  return (
    <main className="page-fade auth-layout" style={{ minHeight: "100vh", placeItems: "center", padding: "1rem" }}>
      <Card style={{ width: "min(100%, 480px)", padding: "1.25rem" }}>
        <div className="stack" style={{ gap: "1rem" }}>
          <div style={{ display: "grid", justifyItems: "center", gap: "0.75rem" }}>
            <span className="logo-mark">
              <Image
                src={website.logoUrl}
                alt={website.siteName}
                width={56}
                height={56}
                unoptimized
              />
            </span>
            <div style={{ textAlign: "center" }}>
              <h1 className="display-heading" style={{ fontSize: "2rem" }}>
                Create your account
              </h1>
              <p className="muted">Secure email and password auth for premium downloads.</p>
            </div>
          </div>
          <Input label="Email" type="email" placeholder="you@example.com" />
          <Input label="Password" type="password" placeholder="Choose a password" />
          <Input label="Confirm Password" type="password" placeholder="Confirm password" />
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/login" className="subtle-link">
              Already have an account?
            </Link>
            <Link href="/login" className="subtle-link">
              Forgot password?
            </Link>
          </div>
          <Button fullWidth type="submit">
            Register
          </Button>
        </div>
      </Card>
    </main>
  );
}
