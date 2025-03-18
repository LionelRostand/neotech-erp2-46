
import React from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ value, size = 100 }) => {
  // Dans une application réelle, nous utiliserions une bibliothèque QR code comme qrcode.react
  // Pour cette démo, nous utilisons une image générée en base64
  
  // Créer un fond coloré pour le "fake" QR code
  const qrBackground = `data:image/svg+xml,${encodeURIComponent(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="white"/>
      <rect x="10%" y="10%" width="80%" height="80%" fill="white"/>
      ${Array(10).fill(0).map((_, i) => 
        Array(10).fill(0).map((_, j) => 
          Math.random() > 0.7 ? `<rect x="${i*10}%" y="${j*10}%" width="10%" height="10%" fill="black"/>` : ''
        ).join('')
      ).join('')}
      <rect x="40%" y="40%" width="20%" height="20%" fill="white"/>
      <circle cx="50%" cy="50%" r="15%" fill="black"/>
      <circle cx="50%" cy="50%" r="10%" fill="white"/>
    </svg>
  `)}`;

  return (
    <div
      style={{
        width: size,
        height: size,
        background: `url(${qrBackground})`,
        backgroundSize: '100% 100%',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
      title={`QR Code: ${value}`}
    />
  );
};

export default QRCode;
