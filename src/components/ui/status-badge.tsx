
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Badge } from "./badge"

const statusBadgeVariants = cva("", {
  variants: {
    variant: {
      outline: "bg-transparent text-foreground hover:bg-muted/10",
      success: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
      warning: "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200",
      danger: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
      default: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200",
    }
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: string;
}

function StatusBadge({
  className,
  variant,
  status,
  children,
  ...props
}: StatusBadgeProps) {
  // If no explicit variant is provided but status is, determine variant from status
  let badgeVariant = variant;
  
  if (!variant && status) {
    const statusLower = status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'actif' || statusLower === 'approved' || statusLower === 'approuvé') {
      badgeVariant = 'success';
    } else if (statusLower === 'pending' || statusLower === 'en attente' || statusLower === 'onleave' || statusLower === 'en congé') {
      badgeVariant = 'warning';
    } else if (statusLower === 'inactive' || statusLower === 'inactif' || statusLower === 'rejected' || statusLower === 'refusé') {
      badgeVariant = 'danger';
    } else {
      badgeVariant = 'default';
    }
  }

  // Ensure children is a valid React child (string, number, or React element)
  const content = children || status || '';

  // Map our custom variants to Badge-compatible variants
  const finalBadgeVariant = (badgeVariant === 'success' || badgeVariant === 'warning' || badgeVariant === 'danger') 
    ? 'outline' 
    : (badgeVariant || 'default') as "default" | "destructive" | "secondary" | "outline";

  return (
    <Badge
      className={cn(statusBadgeVariants({ variant: badgeVariant as any }), className)}
      variant={finalBadgeVariant}
      {...props}
    >
      {content}
    </Badge>
  )
}

export { StatusBadge, statusBadgeVariants }
