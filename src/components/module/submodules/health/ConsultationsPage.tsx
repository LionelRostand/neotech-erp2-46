
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Clipboard } from 'lucide-react';
import ConsultationsList from './ConsultationsList';

const ConsultationsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <Helmet>
        <title>Consultations | Santé | NEOTECH-ERP</title>
      </Helmet>
      
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clipboard className="h-6 w-6 text-primary" />
          Consultations
        </h1>
        <p className="text-muted-foreground">
          Gérez les consultations médicales et suivez l'historique des patients
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <ConsultationsList />
      </div>
    </div>
  );
};

export default ConsultationsPage;
