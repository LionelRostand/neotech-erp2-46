
import React from 'react';
import { ChartNode, HierarchyNode, HierarchyVisualizationProps } from './types';
import { convertToChartNode } from './utils/hierarchyUtils';
import EmptyHierarchy from './components/EmptyHierarchy';
import OrgChartNode from './components/OrgChartNode';
import TreeViewNode from './components/TreeViewNode';
import { useHierarchyData } from './hooks/useHierarchyData';

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  data: externalData,
  viewMode, 
  searchQuery 
}) => {
  // Utiliser notre hook personnalisé pour obtenir des données qui se mettent à jour automatiquement
  const { hierarchyData: liveData, isLoading } = useHierarchyData();
  
  // Utiliser les données externes si fournies, sinon utiliser les données en direct
  const chartData = externalData ? ('position' in externalData ? externalData : convertToChartNode(externalData as HierarchyNode)) : liveData;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!chartData) {
    return <EmptyHierarchy />;
  }

  return (
    <div className="overflow-auto max-h-[calc(100vh-250px)]">
      <div className="inline-block min-w-full p-4">
        {viewMode === 'orgChart' ? (
          <div className="flex justify-center">
            <OrgChartNode node={chartData} searchQuery={searchQuery} />
          </div>
        ) : (
          <div className="space-y-2">
            <TreeViewNode node={chartData} searchQuery={searchQuery} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyVisualization;
