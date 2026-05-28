import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="empty-state">
      <div className="empty-illustration">{icon}</div>
      <div>
        <h3 className="display-heading" style={{ fontSize: "1.4rem" }}>
          {title}
        </h3>
        <p className="muted">{description}</p>
      </div>
      {action}
    </Card>
  );
}
