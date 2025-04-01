
import React from 'react';
import ElementItem from '../ElementItem';
import { ElementDefinition } from '../constants/elements';

interface ElementsListProps {
  elements: ElementDefinition[];
}

const ElementsList: React.FC<ElementsListProps> = ({ elements }) => {
  return (
    <div className="space-y-1 px-2">
      {elements.map(element => (
        <ElementItem
          key={element.type}
          icon={element.icon}
          label={element.label}
          className="p-3 flex items-center space-x-2 hover:bg-muted transition-colors"
        />
      ))}
    </div>
  );
};

export default ElementsList;
