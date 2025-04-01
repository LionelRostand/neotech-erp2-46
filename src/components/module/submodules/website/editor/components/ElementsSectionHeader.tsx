
import React from 'react';
import { TransportChevronsUpDown } from '@/components/icons/ChevronIcons';

interface ElementsSectionHeaderProps {
  title: string;
  onClick?: () => void;
}

const ElementsSectionHeader: React.FC<ElementsSectionHeaderProps> = ({ title, onClick }) => {
  return (
    <h3 
      className="px-2 mb-2 font-medium flex items-center justify-between cursor-pointer" 
      onClick={onClick}
    >
      {title}
      <TransportChevronsUpDown />
    </h3>
  );
};

export default ElementsSectionHeader;
