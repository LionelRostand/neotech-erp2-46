
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryHeaderProps {
  category: string;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
  hasModules?: boolean;
}

const CategoryHeader = ({ 
  category, 
  isExpanded, 
  onToggle,
  className,
  hasModules = false
}: CategoryHeaderProps) => {
  const categoryLabels: { [key: string]: string } = {
    business: 'BUSINESS',
    services: 'SERVICES SPÉCIALISÉS',
    digital: 'DIGITAL',
    communication: 'COMMUNICATION'
  };

  const getCategoryColorClass = (category: string, hasModules: boolean) => {
    if (!hasModules) return 'text-black'; // Default color when no modules
    
    switch (category) {
      case 'business':
        return 'text-module-business';
      case 'services':
        return 'text-module-services';
      case 'digital':
        return 'text-module-digital';
      case 'communication':
        return 'text-module-communication';
      default:
        return 'text-black';
    }
  };

  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full flex items-center justify-between px-2 py-2 text-xs font-semibold cursor-pointer',
        getCategoryColorClass(category, hasModules),
        className
      )}
      role="button"
      aria-expanded={isExpanded}
    >
      <span>{categoryLabels[category] || category.toUpperCase()}</span>
      <ChevronRight
        size={14}
        className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
      />
    </button>
  );
};

export default CategoryHeader;
