
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ElementItem from '../ElementItem';
import { ElementDefinition } from '../constants/elements';

interface ElementsGridProps {
  elements: ElementDefinition[];
}

const ElementsGrid: React.FC<ElementsGridProps> = ({ elements }) => {
  return (
    <Card className="mx-2 mb-2 border border-dashed border-muted hover:border-primary/50 transition-colors">
      <CardContent className="p-2">
        <div className="grid grid-cols-2 gap-1">
          {elements.map(element => (
            <ElementItem
              key={element.type}
              icon={element.icon}
              label={element.label}
              className="p-3 text-center hover:bg-muted transition-colors"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ElementsGrid;
