
export interface OrgChartNode {
  id: string;
  name: string;
  title?: string;
  photo?: string;
  department?: string;
  email?: string;
  phone?: string;
  children: OrgChartNode[];
  isCollapsed?: boolean;
}
