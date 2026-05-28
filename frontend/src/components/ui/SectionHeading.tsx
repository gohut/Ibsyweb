import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function SectionHeading({
  title,
  eyebrow,
  actionHref,
  actionLabel,
}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="gold-underline">{title}</h2>
      </div>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="subtle-link">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
