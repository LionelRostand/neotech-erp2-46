
import React from 'react';

const DriversHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold">Chauffeurs</h2>
      <div className="flex gap-4">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Chauffeurs actifs</p>
          <p className="text-2xl font-semibold">21/26</p>
        </div>
      </div>
    </div>
  );
};

export default DriversHeader;
