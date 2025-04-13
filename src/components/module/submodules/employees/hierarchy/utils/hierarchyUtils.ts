
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
  const nodeManager = !('position' in node) && node.manager ? node.manager.toLowerCase() : '';
  
  if (
    nodeName.includes(searchLower) ||
    nodePosition.includes(searchLower) ||
    nodeDepartment.includes(searchLower) ||
    nodeManager.includes(searchLower)
  ) {
    return true;
  }
  
  // Check children
  return node.children.some(child => nodeMatchesSearch(child, searchLower));
};

/**
 * Helper function to get total count of nodes in hierarchy
 */
export const countNodes = (node: ChartNode | HierarchyNode): number => {
  if (!node) return 0;
  
  let count = 1; // Count this node
  
  // Add count of all children
  if (node.children && node.children.length > 0) {
    count += node.children.reduce((acc, child) => acc + countNodes(child), 0);
  }
  
  return count;
};

/**
 * Helper function to get the maximum depth of a node
 */
export const getMaxDepth = (node: ChartNode | HierarchyNode): number => {
  if (!node || !node.children || node.children.length === 0) {
    return 1;
  }
  
  const childrenDepths = node.children.map(child => getMaxDepth(child));
  const maxChildDepth = Math.max(...childrenDepths);
  
  return 1 + maxChildDepth;
};

/**
 * Helper function to count manager nodes (nodes with children)
 */
export const countManagerNodes = (node: ChartNode | HierarchyNode): number => {
  if (!node) return 0;
  
  // This node is a manager if it has children
  const isManager = node.children && node.children.length > 0 ? 1 : 0;
  
  // Add count of managers in children
  const managersInChildren = node.children 
    ? node.children.reduce((acc, child) => acc + countManagerNodes(child), 0) 
    : 0;
  
  return isManager + managersInChildren;
};

/**
 * Helper function to extract all departments from a hierarchy
 */
export const getAllDepartments = (node: ChartNode | HierarchyNode): Set<string> => {
  const departments = new Set<string>();
  
  const addDepartmentsRecursive = (n: ChartNode | HierarchyNode) => {
    // Add department from this node
    if ('department' in n && n.department) {
      departments.add(n.department);
    } else if (n.color) {
      // Si un nœud a une couleur, cela indique généralement un département
      departments.add(n.name);
    }
    
    // Get departments from children
    if (n.children) {
      n.children.forEach(child => addDepartmentsRecursive(child));
    }
  };
  
  addDepartmentsRecursive(node);
  return departments;
};

/**
 * Fonction pour synchroniser les compteurs avec les données des départements
 */
export const getSyncedStats = (hierarchyData: HierarchyNode | ChartNode | null, departmentsCount: number, managersCount: number) => {
  if (!hierarchyData) {
    return {
      totalEmployees: 0,
      managerCount: managersCount || 0,
      maxDepth: 0,
      departmentsRepresented: departmentsCount || 0
    };
  }

  const calculatedManagers = countManagerNodes(hierarchyData);
  const calculatedDepartments = getAllDepartments(hierarchyData).size;
  
  return {
    totalEmployees: countNodes(hierarchyData),
    managerCount: Math.max(calculatedManagers, managersCount || 0),
    maxDepth: getMaxDepth(hierarchyData),
    departmentsRepresented: Math.max(calculatedDepartments, departmentsCount || 0)
  };
};
