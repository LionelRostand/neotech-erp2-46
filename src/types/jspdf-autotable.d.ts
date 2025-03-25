
import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: {
      (options: any): jsPDF;
      previous?: {
        finalY?: number;
      };
      getNumberOfPages?: () => number;
    };
    internal: {
      getNumberOfPages: () => number;
    };
  }
}
