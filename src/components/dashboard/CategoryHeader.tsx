
import React from 'react';
import { Building2, Headphones, Globe, MessageSquare } from 'lucide-react';

interface CategoryHeaderProps {
  category: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, isExpanded, onToggle }) => {
  // Function to get category title
  const getCategoryTitle = (category: string): string => {
    switch (category) {
      case 'business': return 'GESTION D\'ENTREPRISE';
      case 'services': return 'SERVICES SPÉCIALISÉS';
      case 'digital': return 'PRÉSENCE NUMÉRIQUE';
      case 'communication': return 'COMMUNICATION';
      default: return '';
    }
  };
  
  // Function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business': return <Building2 size={14} />;
      case 'services': return <Headphones size={14} />;
      case 'digital': return <Globe size={14} />;
      case 'communication': return <MessageSquare size={14} />;
      default: return null;
    }
  };

  return (
    <div 
      className={`px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between cursor-pointer ${
        isExpanded ? 'bg-neotech-primary/10 rounded' : ''
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        {getCategoryIcon(category)}
        <span>{getCategoryTitle(category)}</span>
      </div>
      <span>{isExpanded ? '−' : '+'}</span>
    </div>
  );
};

export default CategoryHeader;
