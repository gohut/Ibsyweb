import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

export function Button({
  className = "",
  variant = "primary",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`royal-button ${variant} ${className}`.trim()}
      style={fullWidth ? { width: "100%" } : undefined}
      {...props}
    />
  );
}
