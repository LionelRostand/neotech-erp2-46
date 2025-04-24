
import { cn } from "@/lib/utils";

export type StatusType = "success" | "warning" | "danger" | "default" | "destructive" | string;

interface StatusBadgeProps {
  status?: StatusType;
  variant?: StatusType; // Added for compatibility
  children?: React.ReactNode;
  className?: string;
}

const StatusBadge = ({ status, variant, children, className }: StatusBadgeProps) => {
  // Use either status or variant prop, with status taking precedence
  const statusValue = status || variant || "default";

  const statusClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    destructive: "bg-red-100 text-red-800 border-red-200", // Alias for danger
    default: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border", 
        statusClasses[statusValue as keyof typeof statusClasses] || statusClasses.default, 
        className
      )}
    >
      {children}
    </span>
  );
};

export default StatusBadge;
