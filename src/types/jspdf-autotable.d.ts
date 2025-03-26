
import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY?: number;
    };
    internal: {
      getNumberOfPages: () => number;
      [key: string]: any;  // Allow for any other properties that might exist on internal
    };
  }
}
