
import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface ModuleContainerProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
}

/**
 * ModuleContainer isolates each module to limit configurations and improve maintainability.
 * Each module should be wrapped with this container to ensure proper isolation.
 */
const ModuleContainer: React.FC<ModuleContainerProps> = ({
  children,
  title,
  className,
  fullWidth = false,
  noPadding = false
}) => {
  return (
    <Card className={cn(
      "mb-6 overflow-hidden",
      fullWidth ? "w-full" : "max-w-[1200px] mx-auto",
      className
    )}>
      {title && (
        <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}
      <div className={cn(
        "bg-white dark:bg-gray-900",
        noPadding ? "" : "p-6"
      )}>
        {children}
      </div>
    </Card>
  );
};

export default ModuleContainer;
