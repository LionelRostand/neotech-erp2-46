
import React from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { QrCode, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceQRCodeProps {
  invoiceData: {
    id: string;
    number: string;
    date: string;
    amount: number;
    client: string;
    dueDate?: string;
  };
  size?: number;
  showControls?: boolean;
}

const QRCodeInvoice: React.FC<InvoiceQRCodeProps> = ({ 
  invoiceData, 
  size = 128, 
  showControls = true 
}) => {
  // Create the QR code value with structured data
  const qrValue = JSON.stringify({
    type: 'INVOICE',
    id: invoiceData.id,
    number: invoiceData.number,
    date: invoiceData.date,
    amount: invoiceData.amount,
    client: invoiceData.client,
    dueDate: invoiceData.dueDate,
    issuer: 'NEOTECH-CONSULTING'
  });

  // Function to download QR code as SVG
  const handleDownloadQR = () => {
    const svg = document.getElementById('invoice-qr-code');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `facture-${invoiceData.number}-qr.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    toast.success('QR Code téléchargé avec succès');
  };

  // Function to preview QR code
  const handlePreviewQR = () => {
    // In a real app this would open a modal with full size QR code
    toast.info('Aperçu du QR Code');
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="bg-white p-3 rounded-md shadow-sm">
        <QRCode
          id="invoice-qr-code"
          value={qrValue}
          size={size}
          level="M" // Medium error correction level
          className="rounded-md"
        />
      </div>
      
      {showControls && (
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handlePreviewQR}>
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="sr-only md:not-sr-only md:inline-block">Aperçu</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Aperçu du QR Code</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleDownloadQR}>
                  <Download className="h-4 w-4 mr-1" />
                  <span className="sr-only md:not-sr-only md:inline-block">Télécharger</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Télécharger le QR Code</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default QRCodeInvoice;
