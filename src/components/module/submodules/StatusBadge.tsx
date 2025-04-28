
import { cn } from "@/lib/utils";

export type StatusType = "success" | "warning" | "danger" | string; // Add string to make it more flexible

interface StatusBadgeProps {
  status: StatusType;
  children?: React.ReactNode;
  className?: string;
}

const StatusBadge = ({ status, children, className }: StatusBadgeProps) => {
  const statusClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    danger: "bg-red-100 text-red-800 border-red-200",
  };

  // Ensure content is a valid React child (string, number, or React element)
  const content = children || status || '';
  const displayContent = typeof content === 'object' ? 
    (content === null ? '' : JSON.stringify(content)) : 
    String(content);

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border", 
        statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-800 border-gray-200", 
        className
      )}
    >
      {displayContent}
    </span>
  );
};

export default StatusBadge;
