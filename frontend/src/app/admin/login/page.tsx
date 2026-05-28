"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/components/providers/AppStateProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useAppState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <main className="page-fade auth-layout" style={{ minHeight: "100vh", placeItems: "center", padding: "1rem" }}>
      <Card style={{ width: "min(100%, 420px)", padding: "1.25rem" }}>
        <div className="stack" style={{ gap: "1rem" }}>
          <div>
            <p className="eyebrow">Protected route</p>
            <h1 className="display-heading" style={{ fontSize: "2rem" }}>
              Admin Login
            </h1>
            <p className="muted">Protected by exact credential matching and secure httpOnly session cookies.</p>
          </div>
          <Input
            label="Username"
            placeholder="admin"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            fullWidth
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
              });

              if (!response.ok) {
                showToast("Invalid admin credentials.", "error");
                setSubmitting(false);
                return;
              }

              showToast("Admin login successful.");
              router.push("/admin");
              router.refresh();
            }}
          >
            {submitting ? "Signing In..." : "Enter Dashboard"}
          </Button>
        </div>
      </Card>
    </main>
  );
}
