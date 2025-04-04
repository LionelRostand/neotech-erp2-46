
import React from 'react';

export interface CompanyInfoSectionProps {
  name: string;
  address: string;
  siret: string;
  logo?: string;
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  name,
  address,
  siret,
  logo
}) => {
  return (
    <div className="space-y-2">
      {logo && (
        <img 
          src={logo} 
          alt={`Logo ${name}`} 
          className="h-12 w-auto object-contain" 
        />
      )}
      <h3 className="font-bold text-lg">{name}</h3>
      <div className="space-y-1 text-sm">
        <p>{address}</p>
        <p><span className="font-medium">SIRET:</span> {siret}</p>
      </div>
    </div>
  );
};

export default CompanyInfoSection;
