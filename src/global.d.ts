
declare global {
  interface Window {
    L: any; // Leaflet global object
    ChevronsUpDown: any; 
  }
}

// Add correct types for jspdf-autotable
declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  type FontStyle = 'normal' | 'bold' | 'italic' | 'bolditalic';
  type HAlignType = 'left' | 'center' | 'right' | 'justify';
  type VAlignType = 'top' | 'middle' | 'bottom';

  interface Content {
    content: string | string[] | number;
    styles?: ContentStyles;
  }

  interface ContentStyles {
    font?: string;
    fontStyle?: FontStyle;
    fontSize?: number;
    halign?: HAlignType;
    valign?: VAlignType;
    minCellWidth?: number;
    minCellHeight?: number;
  }

  interface CellDef {
    content: string | string[] | number;
    rowSpan?: number;
    colSpan?: number;
    styles?: ContentStyles;
  }

  type CellInput = string | number | boolean | CellDef;
  type RowInput = CellInput[] | { [key: string]: CellInput };

  interface TableStyles {
    styles?: ContentStyles;
    headStyles?: ContentStyles;
    bodyStyles?: ContentStyles;
    footStyles?: ContentStyles;
    alternateRowStyles?: ContentStyles;
    columnStyles?: { [key: string]: ContentStyles };
  }

  interface JsPDFAutoTableOptions extends TableStyles {
    head?: RowInput[];
    body: RowInput[];
    foot?: RowInput[];
    startY?: number;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    pageBreak?: 'auto' | 'avoid' | 'always';
    rowPageBreak?: 'auto' | 'avoid';
    tableWidth?: 'auto' | 'wrap' | number;
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    theme?: 'striped' | 'grid' | 'plain';
    didDrawPage?: (data: any) => void;
    didParseCell?: (data: any) => void;
    willDrawCell?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    drawCell?: (data: any) => void;
  }

  function autoTable(doc: jsPDF, options: JsPDFAutoTableOptions): void;
  function autoTable(doc: jsPDF, options: Partial<JsPDFAutoTableOptions>): void;

  export default autoTable;
}

export {};
