
import React from 'react';
import QRCodeGenerator from '../../freight/tracking/QRCodeGenerator';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 150, className = "" }) => {
  if (!value) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded ${className}`} style={{ width: size, height: size }}>
        <p className="text-xs text-gray-500">Code non disponible</p>
      </div>
    );
  }

  return (
    <QRCodeGenerator
      value={value}
      size={size}
      className={className}
      errorCorrection="H"
    />
  );
};

export default QRCode;
