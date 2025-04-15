
import React, { useEffect, useState, useCallback } from 'react';
import { ChartNode, HierarchyNode, HierarchyVisualizationProps } from './types';
import { convertToChartNode, nodeMatchesSearch } from './utils/hierarchyUtils';
import EmptyHierarchy from './components/EmptyHierarchy';
import OrgChartNode from './components/OrgChartNode';
import TreeViewNode from './components/TreeViewNode';
import { subscribeToDepartmentUpdates } from '../../departments/utils/departmentUtils';
import { toast } from 'sonner';

const HierarchyVisualization: React.FC<HierarchyVisualizationProps> = ({ 
  data: externalData,
  viewMode, 
  searchQuery,
  onRefresh
}) => {
  // État local pour stocker les données du graphique
  const [chartData, setChartData] = useState<ChartNode | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  
  // Mettre à jour les données du graphique lorsque les données externes changent
  useEffect(() => {
    if (externalData) {
      const convertedData = 'position' in externalData 
        ? externalData 
        : convertToChartNode(externalData as HierarchyNode);
      setChartData(convertedData as ChartNode);
      setLastUpdateTime(new Date());
    } else {
      setChartData(null);
    }
  }, [externalData]);

  // Fonction de rafraîchissement avec délai minimum
  const handleRefresh = useCallback(() => {
    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - lastUpdateTime.getTime();
    
    // Éviter les rafraîchissements trop fréquents (minimum 5 secondes entre les mises à jour)
    if (timeSinceLastUpdate > 5000) {
      console.log("Rafraîchissement de la hiérarchie depuis la visualisation");
      if (onRefresh) {
        onRefresh();
        setLastUpdateTime(now);
        toast.info("Organigramme mis à jour");
      }
    } else {
      console.log("Rafraîchissement ignoré (trop fréquent)");
    }
  }, [onRefresh, lastUpdateTime]);

  // S'abonner aux mises à jour des départements
  useEffect(() => {
    // Fonction pour gérer les mises à jour des départements
    const handleDepartmentsUpdate = () => {
      console.log("Départements ou employés mis à jour, rafraîchissement de la hiérarchie");
      handleRefresh();
    };
    
    // S'abonner aux événements de mise à jour des départements
    const unsubscribe = subscribeToDepartmentUpdates(handleDepartmentsUpdate);
    
    // Se désabonner lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, [handleRefresh]);
  
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
