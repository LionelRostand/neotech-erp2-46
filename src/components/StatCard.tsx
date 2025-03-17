
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  className?: string;
}

const StatCard = ({ title, value, icon, description, className }: StatCardProps) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md animate-scale-in",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <div className="icon-container">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold mb-1 tracking-tight">{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default StatCard;
