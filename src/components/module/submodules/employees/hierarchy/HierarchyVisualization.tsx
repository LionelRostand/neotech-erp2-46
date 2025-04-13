
import React, { useEffect, useState } from 'react';
import { ChartNode, HierarchyNode, HierarchyVisualizationProps } from './types';
import { convertToChartNode, nodeMatchesSearch } from './utils/hierarchyUtils';
import EmptyHierarchy from './components/EmptyHierarchy';
import OrgChartNode from './components/OrgChartNode';
import TreeViewNode from './components/TreeViewNode';
import { subscribeToDepartmentUpdates } from '../../departments/utils/departmentUtils';

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  data: externalData,
  viewMode, 
  searchQuery,
  onRefresh
}) => {
  // État local pour stocker les données du graphique
  const [chartData, setChartData] = useState<ChartNode | null>(null);
  
  // Mettre à jour les données du graphique lorsque les données externes changent
  useEffect(() => {
    if (externalData) {
      const convertedData = 'position' in externalData 
        ? externalData 
        : convertToChartNode(externalData as HierarchyNode);
      setChartData(convertedData as ChartNode);
    } else {
      setChartData(null);
    }
  }, [externalData]);

  // S'abonner aux mises à jour des départements
  useEffect(() => {
    // Fonction pour gérer les mises à jour des départements
    const handleDepartmentsUpdate = () => {
      console.log("Départements mis à jour, rafraîchissement de la hiérarchie");
      if (onRefresh) {
        onRefresh();
      }
    };
    
    // S'abonner aux événements de mise à jour des départements
    const unsubscribe = subscribeToDepartmentUpdates(handleDepartmentsUpdate);
    
    // Se désabonner lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, [onRefresh]);
  
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
