import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "bordered";
  glow?: boolean;
  children: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = false, children, ...props }, ref) => {
    const baseClasses = "relative overflow-hidden rounded-2xl backdrop-blur-md transition-all duration-300";
    
    const variants = {
      default: "bg-white/10 border border-white/20",
      elevated: "bg-white/20 border border-white/30 shadow-2xl",
      bordered: "bg-white/5 border-2 border-gradient-to-r from-blue-400/50 to-purple-400/50"
    };

    const glowEffect = glow ? "shadow-[0_8px_32px_rgba(59,130,246,0.2)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.3)]" : "";

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={cn(
          baseClasses,
          variants[variant],
          glowEffect,
          className
        )}
        {...props}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-cyan-400/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        
        {/* Border glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-purple-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm" />
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {children}
        </div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-br-full opacity-50" />
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-tl-full opacity-50" />
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };