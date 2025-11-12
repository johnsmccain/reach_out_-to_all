import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FuturisticButtonProps {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const FuturisticButton = React.forwardRef<HTMLButtonElement, FuturisticButtonProps>(
  ({ className, variant = "primary", size = "md", glow = false, children, onClick, disabled }, ref) => {
    const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300 rounded-lg border";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500/50 hover:from-blue-500 hover:to-purple-500",
      secondary: "bg-gradient-to-r from-gray-700 to-gray-800 text-white border-gray-600/50 hover:from-gray-600 hover:to-gray-700",
      accent: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-400/50 hover:from-cyan-400 hover:to-blue-400",
      ghost: "bg-transparent text-blue-600 border-blue-600/50 hover:bg-blue-600/10"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3 text-lg"
    };

    const glowEffect = glow ? "shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]" : "";

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          glowEffect,
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Border glow */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm" />
      </motion.button>
    );
  }
);

FuturisticButton.displayName = "FuturisticButton";

export { FuturisticButton };