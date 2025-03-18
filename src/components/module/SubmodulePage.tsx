
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, BadgeCheck, User } from 'lucide-react';
import { modules } from '@/data/modules';
import { AppModule, SubModule } from '@/data/types/modules';
import StatCard from '@/components/StatCard';
import DataTable, { Transaction } from '@/components/DataTable';

interface SubmodulePageProps {
  moduleId: number;
  submoduleId: string;
}

const SubmodulePage: React.FC<SubmodulePageProps> = ({ moduleId, submoduleId }) => {
  const [module, setModule] = useState<AppModule | undefined>();
  const [submodule, setSubmodule] = useState<SubModule | undefined>();

  useEffect(() => {
    const foundModule = modules.find(m => m.id === moduleId);
    setModule(foundModule);
    
    if (foundModule?.submodules) {
      const foundSubmodule = foundModule.submodules.find(s => s.id === submoduleId);
      setSubmodule(foundSubmodule);
    }
  }, [moduleId, submoduleId]);

  if (!module || !submodule) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Sous-module non trouvé</CardTitle>
          <CardDescription>
            Le sous-module demandé n'existe pas ou n'est pas accessible.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Generate random data for the employees badges page
  const renderEmployeesBadgesContent = () => {
    if (submoduleId === 'employees-badges') {
      // Sample data for the stats cards
      const statsData = [
        {
          title: "Badges Actifs",
          value: "214",
          icon: <Badge className="h-8 w-8 text-neotech-primary" />,
          description: "Total des badges actuellement actifs"
        },
        {
          title: "Badges Attribués",
          value: "187",
          icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
          description: "Badges assignés à des employés"
        },
        {
          title: "Badges En Attente",
          value: "27",
          icon: <Badge className="h-8 w-8 text-amber-500" />,
          description: "Badges prêts à être attribués"
        },
        {
          title: "Employés",
          value: "175",
          icon: <User className="h-8 w-8 text-blue-500" />,
          description: "Employés avec accès au système"
        }
      ];

      // Sample data for the transactions table
      const badgesData: Transaction[] = [
        {
          id: "B-2458",
          date: "2023-10-15",
          client: "Martin Dupont",
          amount: "Sécurité Niveau 3",
          status: "success",
          statusText: "Actif"
        },
        {
          id: "B-2457",
          date: "2023-10-14",
          client: "Sophie Martin",
          amount: "Administration",
          status: "success",
          statusText: "Actif"
        },
        {
          id: "B-2456",
          date: "2023-10-12",
          client: "Jean Lefebvre",
          amount: "IT",
          status: "warning",
          statusText: "En attente"
        },
        {
          id: "B-2455",
          date: "2023-10-10",
          client: "Emma Bernard",
          amount: "RH",
          status: "success",
          statusText: "Actif"
        },
        {
          id: "B-2454",
          date: "2023-10-09",
          client: "Thomas Petit",
          amount: "Marketing",
          status: "danger",
          statusText: "Désactivé"
        }
      ];

      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
              />
            ))}
          </div>

          <div className="mb-8">
            <DataTable 
              title="Registre des Badges" 
              data={badgesData} 
            />
          </div>
        </>
      );
    }

    // Generate random data for the freight shipments page
    if (submoduleId === 'freight-shipments') {
      // Sample data for the stats cards
      const statsData = [
        {
          title: "Expéditions",
          value: "124",
          icon: <Badge className="h-8 w-8 text-neotech-primary" />,
          description: "Expéditions en cours"
        },
        {
          title: "Livraisons",
          value: "87",
          icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
          description: "Livraisons effectuées ce mois"
        },
        {
          title: "En attente",
          value: "36",
          icon: <Badge className="h-8 w-8 text-amber-500" />,
          description: "Expéditions en attente"
        },
        {
          title: "Transporteurs",
          value: "12",
          icon: <User className="h-8 w-8 text-blue-500" />,
          description: "Transporteurs actifs"
        }
      ];

      // Sample data for the transactions table
      const shipmentsData: Transaction[] = [
        {
          id: "EXP-1024",
          date: "2023-10-15",
          client: "Logistique Express",
          amount: "2,458 €",
          status: "success",
          statusText: "Livré"
        },
        {
          id: "EXP-1023",
          date: "2023-10-14",
          client: "TransportPlus",
          amount: "1,875 €",
          status: "warning",
          statusText: "En transit"
        },
        {
          id: "EXP-1022",
          date: "2023-10-12",
          client: "Cargo International",
          amount: "3,214 €",
          status: "warning",
          statusText: "En transit"
        },
        {
          id: "EXP-1021",
          date: "2023-10-10",
          client: "MariTrans",
          amount: "5,680 €",
          status: "success",
          statusText: "Livré"
        },
        {
          id: "EXP-1020",
          date: "2023-10-09",
          client: "AirCargo",
          amount: "2,950 €",
          status: "danger",
          statusText: "Retardé"
        }
      ];

      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
              />
            ))}
          </div>

          <div className="mb-8">
            <DataTable 
              title="Suivi des Expéditions" 
              data={shipmentsData} 
            />
          </div>
        </>
      );
    }

    // Default content for other submodules
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          {submodule.icon}
        </div>
        <h3 className="text-xl font-bold">Fonctionnalité en développement</h3>
        <p className="mt-2 text-gray-500">
          Cette fonctionnalité est actuellement en cours de développement.<br />
          Elle sera disponible prochainement.
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{module.name} - {submodule.name}</h1>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-neotech-primary">{submodule.icon}</span>
            <span>{submodule.name}</span>
          </CardTitle>
          <CardDescription>
            Fonctionnalité du module {module.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {renderEmployeesBadgesContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmodulePage;
