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
  data: HierarchyNode | ChartNode | null;
  viewMode: 'orgChart' | 'treeView';
  searchQuery: string;
  onRefresh?: () => void;
}
