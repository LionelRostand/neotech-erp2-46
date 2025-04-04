
import React from 'react';

interface CompanyInfoSectionProps {
  name: string;
  address: string;
  siret: string;
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  name,
  address,
  siret
}) => {
  return (
    <div className="space-y-1">
      <div className="w-24 h-16 bg-gray-200 flex items-center justify-center rounded-md mb-2">
        <span className="text-xs text-gray-500">Logo</span>
      </div>
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-sm">{address}</p>
      <p className="text-sm text-gray-600">SIRET: {siret}</p>
    </div>
  );
};

export default CompanyInfoSection;
