
import React, { useState } from 'react';
import ElementsSectionHeader from './ElementsSectionHeader';
import ElementsGrid from './ElementsGrid';
import ElementsList from './ElementsList';
import { ElementDefinition } from '../constants/elements';

interface ElementsSectionProps {
  title: string;
  elements: ElementDefinition[];
  displayAsGrid?: boolean;
}

const ElementsSection: React.FC<ElementsSectionProps> = ({ title, elements, displayAsGrid = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="mt-4">
      <ElementsSectionHeader title={title} onClick={toggleCollapse} />
      {!isCollapsed && (
        <>
          {displayAsGrid ? (
            <ElementsGrid elements={elements} />
          ) : (
            <ElementsList elements={elements} />
          )}
        </>
      )}
    </div>
  );
};

export default ElementsSection;
