
import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

declare module 'jspdf-autotable' {
  import autoTable from 'jspdf-autotable';
  export default autoTable;
}
