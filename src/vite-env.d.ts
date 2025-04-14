
/// <reference types="vite/client" />

// Add support for jsPDF with autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
    lastAutoTable: any;
  }
}
