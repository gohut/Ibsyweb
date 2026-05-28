type RatingStarsProps = {
  rating: number;
};

export function RatingStars({ rating }: RatingStarsProps) {
  const fillPercent = Math.min(Math.max((rating / 5) * 100, 0), 100);
  const gradientId = `star-fill-${Math.round(fillPercent)}`;

  return (
    <span style={{ display: "inline-flex", color: "var(--color-accent-primary)" }}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${fillPercent}%`} stopColor="currentColor" />
            <stop offset={`${fillPercent}%`} stopColor="currentColor" stopOpacity="0.22" />
          </linearGradient>
        </defs>
        <polygon
          points="7.5,1 9.5,5.5 14.5,6 11,9.5 12,14.5 7.5,12 3,14.5 4,9.5 0.5,6 5.5,5.5"
          fill={`url(#${gradientId})`}
        />
      </svg>
    </span>
  );
}