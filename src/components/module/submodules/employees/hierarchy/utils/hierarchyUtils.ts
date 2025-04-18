import { Employee } from '@/types/employee';
import { ChartNode, HierarchyNode } from '../types';

/**
 * Find the CEO or top-level manager in the employees list
 * @param employees List of employees to search through
 * @returns The CEO/top employee or null if none found
 */
export const findCEO = (employees: Employee[]): Employee | null => {
  // First look for employees without a manager or with forceManager=true
  const potentialCEOs = employees.filter(emp => 
    !emp.managerId || emp.forceManager === true
  );
  
  // If there are multiple candidates, prefer the one with forceManager=true
  const forcedManagers = potentialCEOs.filter(emp => emp.forceManager === true);
  if (forcedManagers.length > 0) {
    return forcedManagers[0];
  }
  
  // Otherwise, take the first employee without a manager
  if (potentialCEOs.length > 0) {
    return potentialCEOs[0];
  }
  
  // If no clear CEO, return null
  return null;
};

/**
 * Create a hierarchical tree structure starting from a root employee
 * @param rootEmployee The top-level employee (usually CEO)
 * @param allEmployees All employees list
 * @returns A hierarchy node representing the organizational structure
 */
export const createHierarchyTree = (rootEmployee: Employee, allEmployees: Employee[]): HierarchyNode => {
  // Create the root node
  const rootNode: HierarchyNode = {
    id: rootEmployee.id,
    name: `${rootEmployee.firstName} ${rootEmployee.lastName}`,
    title: rootEmployee.position || rootEmployee.title || 'CEO',
    manager: rootEmployee.manager || undefined,
    color: rootEmployee.department ? `hsl(${hashStringToNumber(rootEmployee.department)}, 70%, 50%)` : undefined,
    imageUrl: rootEmployee.photoURL || rootEmployee.photo || '',
    children: []
  };
  
  // Find all direct reports (employees whose managerId is the root employee's id)
  const directReports = allEmployees.filter(emp => emp.managerId === rootEmployee.id);
  
  // For each direct report, recursively build their hierarchy
  rootNode.children = directReports.map(report => 
    createHierarchyTree(report, allEmployees)
  );
  
  return rootNode;
};

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
    } else if ('color' in n && n.color) {
      // If a node has a color, it usually indicates a department
      departments.add(n.name);
    } else if ('departmentColor' in n && n.departmentColor) {
      // Handle ChartNode which has departmentColor instead of color
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
 * Function to sync counters with department data
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

/**
 * Helper function to convert a string to a consistent number (for color generation)
 */
const hashStringToNumber = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash % 360); // Get a value between 0-360 for HSL color
};
