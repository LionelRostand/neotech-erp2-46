
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type AlertVariant = "default" | "destructive" | "warning" | "success";

interface FreightAlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const FreightAlert: React.FC<FreightAlertProps> = ({
  variant = "default",
  title,
  children,
  className,
}) => {
  // Map custom variants to supported variants + custom styles
  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return "border-amber-200 bg-amber-50 text-amber-800 [&>svg]:text-amber-800";
      case "success":
        return "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-800";
      case "destructive":
        return ""; // Default styles from shadcn
      default:
        return ""; // Default styles from shadcn
    }
  };

  return (
    <Alert className={cn(getVariantStyles(), className)}>
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
