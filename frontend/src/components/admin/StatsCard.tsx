import { Card } from "@/components/ui/Card";

type StatsCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function StatsCard({ label, value, detail }: StatsCardProps) {
  return (
    <Card className="stats-card">
      <p className="eyebrow">{label}</p>
      <strong className="stat-number" style={{ fontSize: "2rem" }}>
        {value}
      </strong>
      <p className="muted">{detail}</p>
    </Card>
  );
}
