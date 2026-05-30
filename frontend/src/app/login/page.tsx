"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/components/providers/SettingsProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const {
    settings: { website },
  } = useSettings();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/library");
      router.refresh();
    }
  };

  return (
    <main className="page-fade auth-layout" style={{ minHeight: "100vh", placeItems: "center", padding: "1rem" }}>
      <Card style={{ width: "min(100%, 480px)", padding: "1.25rem" }}>
        <form onSubmit={handleLogin} className="stack" style={{ gap: "1rem" }}>
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
                Welcome back
              </h1>
              <p className="muted">Sign in with Supabase Auth email and password.</p>
            </div>
          </div>
          
          {error && (
            <div style={{ padding: "0.75rem", background: "#fee2e2", color: "#991b1b", borderRadius: "0.375rem", fontSize: "0.875rem" }}>
              {error}
            </div>
          )}

          <Input 
            label="Email" 
            type="email" 
            placeholder="you@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/register" className="subtle-link">
              Create an account
            </Link>
            <Link href="/login" className="subtle-link">
              Forgot password?
            </Link>
          </div>
          <Button fullWidth type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
