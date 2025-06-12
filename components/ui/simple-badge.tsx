import React from 'react';
import { cn } from "@/lib/utils";

interface SimpleBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function SimpleBadge({ children, className }: SimpleBadgeProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        "bg-green-50 text-green-700 border-green-200", 
        className
      )}
    >
      {children}
    </span>
  );
} 