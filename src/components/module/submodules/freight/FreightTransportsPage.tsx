
import React from "react";
import { CarFront } from "lucide-react";

const FreightTransportsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CarFront className="text-teal-600" size={28} />
        <h1 className="text-2xl font-bold">Transports</h1>
      </div>
      <p className="text-gray-600">
        Ceci est la page Transports du module Freight Management. 
        <br />
        Vous pouvez personnaliser ici les fonctionnalités liées aux transports de marchandises.
      </p>
    </div>
  );
};

export default FreightTransportsPage;
