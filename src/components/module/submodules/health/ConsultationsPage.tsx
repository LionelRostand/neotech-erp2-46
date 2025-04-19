
import React from 'react';
import { Helmet } from 'react-helmet-async';
import SubmoduleHeader from '../SubmoduleHeader';
import ConsultationsList from './ConsultationsList';

const ConsultationsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <Helmet>
        <title>Consultations | Santé | NEOTECH-ERP</title>
      </Helmet>
      
      <SubmoduleHeader 
        title="Consultations" 
        description="Gérez les consultations médicales et suivez l'historique des patients"
      />
      
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
        <ConsultationsList />
      </div>
    </div>
  );
};

export default ConsultationsPage;
