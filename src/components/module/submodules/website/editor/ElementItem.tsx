
import React from 'react';
import { cn } from '@/lib/utils';

interface ElementItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

const ElementItem: React.FC<ElementItemProps> = ({ icon, label, onClick, className }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('elementType', label.toLowerCase());
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors text-center",
        className
      )}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs truncate max-w-full">{label}</span>
    </div>
  );
};

export default ElementItem;
