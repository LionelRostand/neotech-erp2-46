
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  errorCorrection?: 'L' | 'M' | 'Q' | 'H';
  darkColor?: string;
  lightColor?: string;
}

/**
 * Component for generating QR codes for freight tracking
 */
const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size = 128,
  className = "",
  errorCorrection = 'M',
  darkColor = '#000000',
  lightColor = '#ffffff'
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const generateQRCode = async () => {
      if (!value || value.trim() === '') {
        setError('Valeur vide. Impossible de générer un QR code.');
        setQrCodeDataUrl('');
        return;
      }
      
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 1,
          errorCorrectionLevel: errorCorrection,
          color: {
            dark: darkColor,
            light: lightColor
          }
        });
        
        setQrCodeDataUrl(dataUrl);
        setError(null);
      } catch (error) {
        console.error('Error generating QR code:', error);
        setError('Erreur lors de la génération du QR code.');
        setQrCodeDataUrl('');
      }
    };
    
    generateQRCode();
  }, [value, size, errorCorrection, darkColor, lightColor]);
  
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded ${className}`} style={{ width: size, height: size }}>
        <p className="text-xs text-red-500 text-center p-2">{error}</p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      {qrCodeDataUrl ? (
        <img 
          src={qrCodeDataUrl} 
          alt={`QR Code: ${value}`}
          style={{ width: size, height: size }}
          className="max-w-full rounded"
        />
      ) : (
        <div className="flex items-center justify-center bg-gray-100 rounded animate-pulse" style={{ width: size, height: size }}>
          <p className="text-xs text-gray-500">Chargement...</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
