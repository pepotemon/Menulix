import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-leaf text-white hover:bg-ink",
  secondary:
    "border border-line bg-white text-ink hover:border-leaf hover:text-leaf",
  ghost: "bg-transparent text-ink/68 hover:bg-cream hover:text-ink",
  danger:
    "border border-line bg-white text-ink hover:border-tomato hover:text-tomato"
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 py-2 text-sm",
  md: "min-h-11 px-4 py-2 text-sm",
  lg: "min-h-12 px-5 py-3 text-sm",
  icon: "h-10 w-10"
};

export function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-leaf/20 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
}

