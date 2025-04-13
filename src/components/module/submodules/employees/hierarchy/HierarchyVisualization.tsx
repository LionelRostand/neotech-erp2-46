
import React from 'react';
import { ChartNode, HierarchyNode, HierarchyVisualizationProps } from './types';
import { convertToChartNode, nodeMatchesSearch } from './utils/hierarchyUtils';
import EmptyHierarchy from './components/EmptyHierarchy';
import OrgChartNode from './components/OrgChartNode';
import TreeViewNode from './components/TreeViewNode';

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  data: externalData,
  viewMode, 
  searchQuery 
}) => {
  // Déterminer quelle donnée utiliser pour l'affichage
  const chartData = externalData 
    ? ('position' in externalData ? externalData : convertToChartNode(externalData as HierarchyNode)) 
    : null;
  
  // Afficher un message si aucune donnée n'est disponible
  if (!chartData) {
    return <EmptyHierarchy />;
  }

  // Filtrer les données en fonction de la recherche si nécessaire
  const shouldFilter = searchQuery && searchQuery.trim().length > 0;
  
  const renderNode = (node: ChartNode) => {
    if (shouldFilter && !nodeMatchesSearch(node, searchQuery)) {
      return null;
    }
    
    if (viewMode === 'orgChart') {
      return <OrgChartNode key={node.id} node={node} searchQuery={searchQuery} />;
    } else {
      return <TreeViewNode key={node.id} node={node} searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="overflow-auto max-h-[calc(100vh-250px)]">
      <div className="inline-block min-w-full p-4">
        {viewMode === 'orgChart' ? (
          <div className="flex justify-center">
            {renderNode(chartData)}
          </div>
        ) : (
          <div className="space-y-2">
            {renderNode(chartData)}
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyVisualization;
