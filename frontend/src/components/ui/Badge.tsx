import type { HTMLAttributes } from "react";

export function Badge({
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`pill ${className}`.trim()} {...props} />;
}
