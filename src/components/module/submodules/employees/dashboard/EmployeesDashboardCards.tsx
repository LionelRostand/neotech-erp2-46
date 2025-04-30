
import React from 'react';
import { Users, Building2, UserCheck } from 'lucide-react';
import { useEmployeeData } from '@/hooks/useEmployeeData';

const EmployeesDashboardCards = () => {
  const { employees = [], departments = [], isLoading } = useEmployeeData();
  
  // Calculate statistics
  const totalEmployees = employees?.length || 0;
  const activeDepartments = departments?.length || 0;
  const activeEmployees = employees?.filter(emp => emp?.status === 'active' || emp?.status === 'Actif')?.length || 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  const cardData = [
    {
      title: "Employés totaux",
      count: totalEmployees,
      description: "Effectif total de l'entreprise",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      bgColor: "bg-blue-50"
    },
    {
      title: "Départements actifs",
      count: activeDepartments,
      description: "Départements avec employés",
      icon: <Building2 className="h-6 w-6 text-purple-600" />,
      bgColor: "bg-purple-50"
    },
    {
      title: "Employés actifs",
      count: activeEmployees,
      description: "Employés en activité",
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
      bgColor: "bg-green-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cardData.map((card, index) => (
        <div 
          key={index} 
          className={`${card.bgColor} p-6 rounded-lg shadow-sm`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-700">{card.title}</h3>
              <p className="text-4xl font-bold mt-2">{card.count}</p>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </div>
            <div className="p-3 rounded-full bg-white shadow-sm">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeesDashboardCards;
