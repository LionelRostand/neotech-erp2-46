
export interface HierarchyNode {
  id: string;
  name: string;
  title: string;
  manager?: string;
  color?: string;
  imageUrl?: string;
  children: HierarchyNode[];
}

export interface ChartNode {
  id: string;
  name: string;
  position: string;
  department?: string;
  departmentColor?: string;
  imageUrl?: string;
  children: ChartNode[];
}

export interface HierarchyVisualizationProps {
  viewMode: 'orgChart' | 'treeView';
  searchQuery: string;
  data: HierarchyNode | ChartNode | null;
  onRefresh?: () => void;
}
