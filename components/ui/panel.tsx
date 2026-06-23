import type { HTMLAttributes, ReactNode } from "react";

interface PanelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: "section" | "article" | "div";
}

export function Panel({
  children,
  className = "",
  as: Component = "section",
  ...props
}: PanelProps): JSX.Element {
  return (
    <Component
      {...props}
      className={`rounded-md border border-line bg-white p-5 shadow-soft ${className}`}
    >
      {children}
    </Component>
  );
}

