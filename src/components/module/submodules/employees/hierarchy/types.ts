
export interface ChartNode {
  id: string;
  name: string;
  position: string;
  department?: string;
  imageUrl?: string;
  children: ChartNode[];
}
