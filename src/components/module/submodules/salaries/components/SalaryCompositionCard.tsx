
import React from 'react';

const SalaryCompositionCard: React.FC = () => {
  return (
    <div className="border rounded-lg p-5 mb-6">
      <div className="flex items-center mb-4">
        <div className="bg-rose-50 rounded-full p-2 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 6v12M12 6v12M5 12h14"/>
          </svg>
        </div>
        <h3 className="font-bold text-lg">Composition du salaire brut</h3>
      </div>
      
      <div className="flex justify-center">
        <div className="w-40 h-40 relative">
          {/* Simple circular representation */}
          <div className="w-full h-full rounded-full border-[20px] border-blue-900"></div>
          <div className="absolute top-0 right-0 w-full h-full rounded-full border-[20px] border-blue-400 border-t-transparent border-r-transparent border-b-transparent" style={{transform: 'rotate(45deg)'}}></div>
          <div className="absolute top-0 right-0 w-full h-full rounded-full border-[20px] border-blue-200 border-t-transparent border-r-transparent border-l-transparent" style={{transform: 'rotate(260deg)'}}></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-900 rounded-full mr-2"></div>
          <div>
            <p className="text-sm">Salaire net après impôt</p>
            <p className="text-xs text-gray-500">75,02 %</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
          <div>
            <p className="text-sm">Prélèvement à la source</p>
            <p className="text-xs text-gray-500">2,62 %</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-200 rounded-full mr-2"></div>
          <div>
            <p className="text-sm">Santé</p>
            <p className="text-xs text-gray-500">1,08 %</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
          <div>
            <p className="text-sm">Autres cotisations</p>
            <p className="text-xs text-gray-500">21,28 %</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryCompositionCard;
