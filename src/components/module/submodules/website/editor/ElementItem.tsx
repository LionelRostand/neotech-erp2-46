
import React from 'react';
import { cn } from '@/lib/utils';

interface ElementItemProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}

const ElementItem: React.FC<ElementItemProps> = ({ icon, label, className, onClick }) => {
  return (
    <div 
      className={cn(
        "rounded cursor-pointer border border-transparent transition-all hover:border-primary/20 hover:bg-primary/5",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-2">
        <span>{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
};

export default ElementItem;
