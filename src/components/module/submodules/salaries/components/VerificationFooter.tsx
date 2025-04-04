
import React from 'react';

interface VerificationFooterProps {
  text?: string;
}

const VerificationFooter: React.FC<VerificationFooterProps> = ({ 
  text = "Document à conserver sans limitation de durée" 
}) => {
  return (
    <div className="border-t pt-4 mt-8 text-center">
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
};

export default VerificationFooter;
