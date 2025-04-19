
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

  // Function to get category-specific colors
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business': return {
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      };
      case 'services': return {
        text: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200'
      };
      case 'digital': return {
        text: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200'
      };
      case 'communication': return {
        text: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200'
      };
      default: return {
        text: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200'
      };
    }
  };

  const categoryColors = getCategoryColor(category);

  return (
    <div 
      className={`px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between cursor-pointer 
        ${isExpanded ? `${categoryColors.bg} ${categoryColors.border} rounded border-b` : ''}
      `}
      onClick={onToggle}
    >
      <div className={`flex items-center gap-2 ${categoryColors.text}`}>
        {getCategoryIcon(category)}
        <span>{getCategoryTitle(category)}</span>
      </div>
      <span>{isExpanded ? '−' : '+'}</span>
    </div>
  );
};

export default CategoryHeader;
