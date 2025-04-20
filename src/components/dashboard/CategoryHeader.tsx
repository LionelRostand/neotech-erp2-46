
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryHeaderProps {
  category: string;
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

const CategoryHeader = ({ 
  category, 
  isExpanded, 
  onToggle,
  className
}: CategoryHeaderProps) => {
  const categoryLabels: { [key: string]: string } = {
    business: 'BUSINESS',
    services: 'SERVICES SPÉCIALISÉS',
    digital: 'DIGITAL',
    communication: 'COMMUNICATION'
  };

  return (
    <button
      onClick={onToggle}
      className={cn(
        'w-full flex items-center justify-between px-2 py-2 text-xs font-semibold cursor-pointer',
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
