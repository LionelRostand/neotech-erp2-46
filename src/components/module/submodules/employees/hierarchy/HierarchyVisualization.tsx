
import React from 'react';
import { ChartNode, HierarchyNode, HierarchyVisualizationProps } from './types';
import { convertToChartNode } from './utils/hierarchyUtils';
import EmptyHierarchy from './components/EmptyHierarchy';
import OrgChartNode from './components/OrgChartNode';
import TreeViewNode from './components/TreeViewNode';

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  data, 
  viewMode, 
  searchQuery 
}) => {
  if (!data) {
    return <EmptyHierarchy />;
  }
  
  // Ensure we're working with a ChartNode
  const chartData = 'position' in data ? data : convertToChartNode(data as HierarchyNode);

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
