
import React from 'react';
import { ChevronsUpDown } from "lucide-react";

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
      <ChevronsUpDown className="h-4 w-4" />
    </h3>
  );
};

export default ElementsSectionHeader;
