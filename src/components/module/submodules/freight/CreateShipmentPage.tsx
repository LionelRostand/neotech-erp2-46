
import React from 'react';
import ShipmentDialogForm from './ShipmentDialogForm';

const CreateShipmentPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Expéditions</h1>
      <div className="flex justify-end mb-4">
        <ShipmentDialogForm />
      </div>
      {/* Ici on pourra afficher plus tard la liste ou le tableau des expéditions */}
    </div>
  );
};

export default CreateShipmentPage;
