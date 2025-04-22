
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Component for generating QR codes for freight tracking
 */
const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size = 128,
  className = ""
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        
        setQrCodeDataUrl(dataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };
    
    generateQRCode();
  }, [value, size]);
  
  return (
    <div className={className}>
      {qrCodeDataUrl ? (
        <img 
          src={qrCodeDataUrl} 
          alt={`QR Code: ${value}`}
          style={{ width: size, height: size }}
          className="max-w-full"
        />
      ) : (
        <div className="flex items-center justify-center" style={{ width: size, height: size }}>
          Chargement...
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
