"use client";

import { cn } from "@/lib/utils";

interface SkillChipProps {
  skill: string;
  variant?: 'offer' | 'want' | 'default';
  className?: string;
  onClick?: () => void;
}

export const SkillChip = ({ skill, variant = 'default', className, onClick }: SkillChipProps) => {
  const baseStyles = "px-4 py-1.5 rounded-xl text-xs font-black border transition-all duration-300 btn-hover-scale";
  
  const variantStyles = {
    offer: "bg-secondary text-primary border-primary/20 hover:bg-primary hover:text-white shadow-sm",
    want: "bg-accent/10 text-accent border-accent/20 hover:bg-accent hover:text-white shadow-sm",
    default: "bg-white text-gray-500 border-gray-100 hover:border-primary/30 hover:text-primary"
  };

  return (
    <button 
      onClick={onClick}
      disabled={!onClick}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {skill}
    </button>
  );
};
