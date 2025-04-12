
export interface HierarchyNode {
  id: string;
  name: string;
  title: string;
  manager?: string;
  color?: string;
  children: HierarchyNode[];
}

export interface ChartNode {
  id: string;
  name: string;
  position: string;
  department?: string;
  imageUrl?: string;
  children: ChartNode[];
}

export interface HierarchyVisualizationProps {
  data: HierarchyNode | ChartNode;
  viewMode: 'orgChart' | 'treeView';
  searchQuery: string;
}
