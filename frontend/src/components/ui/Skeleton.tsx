import type { CSSProperties } from "react";

type SkeletonProps = {
  height?: number;
  style?: CSSProperties;
};

export function Skeleton({ height = 16, style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ height, borderRadius: 12, ...style }}
      aria-hidden="true"
    />
  );
}
