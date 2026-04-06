import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "icon";
};

export function Button({
  children,
  className = "",
  disabled,
  isLoading = false,
  loadingText = "Loading...",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]";

  const variants: Record<string, string> = {
    default:
      "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:brightness-110",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline:
      "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  };

  const sizes: Record<string, string> = {
    default: "h-9 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    icon: "h-9 w-9",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
