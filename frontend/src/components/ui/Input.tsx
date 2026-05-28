import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function Input({
  label,
  hint,
  leading,
  trailing,
  className = "",
  ...props
}: InputProps) {
  return (
    <label className="field">
      {label ? <span>{label}</span> : null}
      <span
        className="surface-card"
        style={{
          display: "grid",
          gridTemplateColumns: leading || trailing ? "auto 1fr auto" : "1fr",
          alignItems: "center",
          gap: "0.75rem",
          paddingInline: "0.9rem",
        }}
      >
        {leading}
        <input className={`royal-input ${className}`.trim()} {...props} />
        {trailing}
      </span>
      {hint ? <small className="muted">{hint}</small> : null}
    </label>
  );
}
