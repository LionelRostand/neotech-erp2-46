
import React from 'react';
import QRCode from 'qrcode.react';

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
  return (
    <div className={className}>
      <QRCode 
        value={value} 
        size={size} 
        renderAs="svg"
        includeMargin={true}
        level="M" // QR code error correction level
      />
    </div>
  );
};

export default QRCodeGenerator;
