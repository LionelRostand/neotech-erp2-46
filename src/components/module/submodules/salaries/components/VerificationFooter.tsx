
import React from 'react';

const VerificationFooter: React.FC = () => {
  return (
    <>
      <div className="flex justify-between items-center mt-10">
        <div className="flex items-start space-x-4">
          <div className="w-24 h-24 bg-gray-200"></div>
          <div className="text-xs">
            <p className="font-medium">Vérifiez</p>
            <p>l'intégrité</p>
            <p>du bulletin</p>
            <p className="mt-3">CODE DE VÉRIFICATION: 518241</p>
          </div>
        </div>
        <div className="text-right max-w-xs">
          <p className="text-base font-medium text-blue-800">Retrouvez tous les détails de votre fichier en deuxième page de votre bulletin de paie</p>
          <div className="mt-2 text-right">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-blue-800">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-8 text-xs text-gray-500 text-center">
        <p>Ce bulletin de paie est conforme aux dispositions de l'article R. 3243-1 du Code du travail.</p>
      </div>
    </>
  );
};

export default VerificationFooter;
