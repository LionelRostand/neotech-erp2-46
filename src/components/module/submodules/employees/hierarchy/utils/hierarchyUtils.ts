
import { Employee } from '@/types/employee';
import { HierarchyNode } from '../types/hierarchy-types';

/**
 * Trouve le CEO ou le responsable principal dans la liste des employés
 */
export const findCEO = (employees: Employee[]): Employee | null => {
  // D'abord, rechercher explicitement le PDG/CEO par son titre
  const ceo = employees.find(emp => 
    (emp.title?.toLowerCase().includes('ceo') || 
     emp.title?.toLowerCase().includes('pdg') ||
     emp.title?.toLowerCase().includes('président') ||
     emp.title?.toLowerCase().includes('directeur général') ||
     emp.position?.toLowerCase().includes('ceo') || 
     emp.position?.toLowerCase().includes('pdg') ||
     emp.position?.toLowerCase().includes('président') ||
     emp.position?.toLowerCase().includes('directeur général')) &&
    (!emp.managerId || emp.managerId === '')
  );

  if (ceo) return ceo;

  // Si aucun PDG n'est trouvé, chercher le premier employé sans manager
  const topLevelEmployee = employees.find(emp => !emp.managerId || emp.managerId === '');
  
  // Si toujours rien, prendre le premier employé de la liste
  return topLevelEmployee || (employees.length > 0 ? employees[0] : null);
};

/**
 * Crée un arbre hiérarchique à partir d'un employé racine
 */
export const createHierarchyTree = (rootEmployee: Employee, allEmployees: Employee[]): HierarchyNode => {
  // Fonction récursive pour construire l'arbre
  const buildTree = (employee: Employee): HierarchyNode => {
    // Trouver tous les subordonnés directs de cet employé
    const directReports = allEmployees.filter(emp => emp.managerId === employee.id);
    
    // Construire le nœud pour cet employé
    const node: HierarchyNode = {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      title: employee.title || employee.position || 'Employé',
      position: employee.position || employee.title || 'Employé',
      department: employee.department || 'Non spécifié',
      imageUrl: employee.photoURL || '',
      employee: employee,
      children: []
    };
    
    // Construire récursivement les sous-arbres pour chaque subordonné
    if (directReports.length > 0) {
      node.children = directReports.map(subordinate => buildTree(subordinate));
    }
    
    return node;
  };
  
  // Commencer la construction à partir de l'employé racine
  return buildTree(rootEmployee);
};

/**
 * Calcule des statistiques basées sur l'arbre hiérarchique
 */
export const calculateHierarchyStats = (hierarchyData: HierarchyNode | null) => {
  if (!hierarchyData) {
    return {
      totalEmployees: 0,
      managerCount: 0,
      maxDepth: 0,
      departmentsRepresented: 0
    };
  }

  let totalEmployees = 0;
  let managerCount = 0;
  let maxDepth = 0;
  const departments = new Set<string>();

  // Fonction récursive pour explorer l'arbre
  const traverseTree = (node: HierarchyNode, depth: number) => {
    totalEmployees++;
    maxDepth = Math.max(maxDepth, depth);
    
    if (node.department) {
      departments.add(node.department);
    }
    
    if (node.children.length > 0) {
      managerCount++;
      node.children.forEach(child => traverseTree(child, depth + 1));
    }
  };

  traverseTree(hierarchyData, 1);

  return {
    totalEmployees,
    managerCount,
    maxDepth,
    departmentsRepresented: departments.size
  };
};

/**
 * Synchroniser les statistiques de l'arbre hiérarchique avec d'autres sources
 */
export const getSyncedStats = (
  hierarchyData: HierarchyNode | null,
  totalDepartments: number,
  totalManagers: number
) => {
  const stats = calculateHierarchyStats(hierarchyData);
  
  return {
    ...stats,
    // Si les départements représentés sont plus grands que le total des départements,
    // utiliser les départements représentés
    departmentsRepresented: Math.max(stats.departmentsRepresented, totalDepartments),
    
    // Idem pour les managers
    managerCount: Math.max(stats.managerCount, totalManagers)
  };
};
