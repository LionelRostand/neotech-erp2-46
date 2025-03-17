
import { cn } from "@/lib/utils";

type StatusType = "success" | "warning" | "danger";

interface StatusBadgeProps {
  status: StatusType;
  text: string;
  className?: string;
}

const StatusBadge = ({ status, text, className }: StatusBadgeProps) => {
  const statusClasses = {
    success: "status-badge-success",
    warning: "status-badge-warning",
    danger: "status-badge-danger",
  };

  return (
    <span className={cn("status-badge", statusClasses[status], className)}>
      {text}
    </span>
  );
};

export default StatusBadge;
