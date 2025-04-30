
import { cn } from "@/lib/utils";

export type StatusType = "success" | "warning" | "danger" | string; // Add string to make it more flexible

interface StatusBadgeProps {
  status: StatusType;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

export const StatusBadge = ({ status, children, className, variant }: StatusBadgeProps) => {
  // Determine the variant based on status if not explicitly provided
  const getVariant = () => {
    if (variant) return variant;
    
    if (status === "success" || status === "approved" || status === "Approuvé") return "success";
    if (status === "warning" || status === "pending" || status === "En attente") return "warning";
    if (status === "danger" || status === "rejected" || status === "Refusé") return "destructive";
    return "default";
  };

  const statusClasses = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    destructive: "bg-red-100 text-red-800 border-red-200",
  };

  // Ensure content is a valid React child (string, number, or React element)
  let content = children || status || '';
  
  // Convert any object to string to prevent "Objects are not valid as React child" error
  const displayContent = typeof content === 'object' ? 
    (content === null ? '' : JSON.stringify(content)) : 
    String(content);

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border", 
        statusClasses[getVariant() as keyof typeof statusClasses], 
        className
      )}
    >
      {displayContent}
    </span>
  );
};

// Also provide a default export for backward compatibility
export default StatusBadge;
