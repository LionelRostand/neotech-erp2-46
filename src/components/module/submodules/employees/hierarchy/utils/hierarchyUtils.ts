
import { ChartNode, HierarchyNode } from '../types';

/**
 * Converts a HierarchyNode to a ChartNode
 */
export const convertToChartNode = (node: HierarchyNode): ChartNode => {
  return {
    id: node.id,
    name: node.name,
    position: node.title,
    department: node.manager ? `Manager: ${node.manager}` : undefined,
    departmentColor: node.color,
    imageUrl: node.imageUrl,
    children: node.children.map(child => convertToChartNode(child))
  };
};

/**
 * Helper function to check if a node or its children match the search query
 */
export const nodeMatchesSearch = (node: ChartNode | HierarchyNode, query: string): boolean => {
  if (!query.trim()) return true;
  
  const searchLower = query.toLowerCase();
  const nodeName = node.name.toLowerCase();
  const nodePosition = 'position' in node ? node.position.toLowerCase() : node.title.toLowerCase();
  const nodeDepartment = 'department' in node && node.department ? node.department.toLowerCase() : '';
  
  if (
    nodeName.includes(searchLower) ||
    nodePosition.includes(searchLower) ||
    nodeDepartment.includes(searchLower)
  ) {
    return true;
  }
  
  // Check children
  return node.children.some(child => nodeMatchesSearch(child, searchLower));
};
