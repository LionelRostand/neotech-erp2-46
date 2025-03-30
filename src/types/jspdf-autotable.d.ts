
// Declare missing jsPDF-AutoTable types
declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface AutoTableOptions {
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    startY?: number;
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    pageBreak?: 'auto' | 'avoid';
    rowPageBreak?: 'auto' | 'avoid';
    tableWidth?: 'auto' | 'wrap' | number;
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    tableLineWidth?: number;
    tableLineColor?: string;
    theme?: 'striped' | 'grid' | 'plain';
    styles?: any;
    columnStyles?: any;
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    didParseCell?: (data: any) => void;
    didDrawCell?: (data: any) => void;
    didDrawPage?: (data: any) => void;
  }

  // Add return type that includes lastAutoTable
  interface AutoTableResult {
    finalY: number;
    pageNumber: number;
    pageCount: number;
    table: any;
    cursor: any;
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): AutoTableResult;

  // Extend the jsPDF prototype
  declare global {
    interface jsPDF {
      autoTable(options: AutoTableOptions): AutoTableResult;
      lastAutoTable: AutoTableResult;
    }
  }

  export default autoTable;
}
