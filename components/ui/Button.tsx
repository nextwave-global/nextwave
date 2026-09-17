import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs min-h-[40px]",
    md: "px-6 py-3 text-sm min-h-[48px]",
    lg: "px-8 py-4 text-base min-h-[56px]",
  };
  const variantClasses = {
    primary:
      "bg-[#c9a84c] hover:bg-[#a8873a] text-[#0d0d0d] font-bold shadow-lg shadow-[#c9a84c]/20 hover:shadow-[#c9a84c]/30",
    secondary:
      "bg-[#1a1a1a] hover:bg-[#242424] text-white border border-[#333333] hover:border-[#c9a84c]",
    outline:
      "border-2 border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-[#0d0d0d]",
    ghost: "text-[#b8b0a8] hover:text-[#c9a84c] hover:bg-[#1a1a1a]",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all active:scale-95 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
