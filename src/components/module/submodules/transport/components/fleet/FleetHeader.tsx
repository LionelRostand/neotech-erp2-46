
import React from 'react';

interface FleetHeaderProps {
  title: string;
}

const FleetHeader: React.FC<FleetHeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold">{title}</h2>
    </div>
  );
};

export default FleetHeader;
