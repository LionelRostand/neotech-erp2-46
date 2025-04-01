
import React from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface ElementItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

const ElementItem: React.FC<ElementItemProps> = ({ icon, label, onClick, className }) => {
  const { toast } = useToast();
  
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('elementType', label.toLowerCase());
    
    // Create a custom drag image
    const dragPreview = document.createElement('div');
    dragPreview.classList.add('bg-primary', 'text-white', 'px-3', 'py-2', 'rounded', 'text-sm', 'font-medium');
    dragPreview.textContent = `Ajouter: ${label}`;
    document.body.appendChild(dragPreview);
    
    // Set the drag image
    e.dataTransfer.setDragImage(dragPreview, 15, 15);
    
    // Clean up after drag starts
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
    
    // Show toast when starting to drag
    toast({
      description: `Faites glisser l'élément ${label} sur la page`,
      duration: 2000
    });
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center border rounded-md hover:bg-accent cursor-grab transition-colors text-center",
        className
      )}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
    >
      {React.isValidElement(icon) ? (
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </div>
      ) : (
        <>
          <div className="mb-1">{icon}</div>
          <span className="text-xs truncate max-w-full">{label}</span>
        </>
      )}
    </div>
  );
};

export default ElementItem;
