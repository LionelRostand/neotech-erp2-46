
import React from 'react';
import { Card } from "@/components/ui/card";
import StatCard from '@/components/StatCard';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Users, 
  CreditCard, 
  BarChart as BarChartIcon, 
  Truck, 
  Car, 
  Store, 
  BookOpen, 
  Calendar, 
  FileText, 
  ShoppingBag,
  MessageSquare,
  Building,
  Activity
} from 'lucide-react';

interface ModuleDashboardPreviewProps {
  moduleId: number;
}

// Sample data for charts
const lineData = [
  { name: 'Jan', value: 400 },
  { name: 'Fév', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Avr', value: 800 },
  { name: 'Mai', value: 700 }
];

const barData = [
  { name: 'Lun', value: 20 },
  { name: 'Mar', value: 30 },
  { name: 'Mer', value: 25 },
  { name: 'Jeu', value: 40 },
  { name: 'Ven', value: 35 }
];

const pieData = [
  { name: 'A', value: 400 },
  { name: 'B', value: 300 },
  { name: 'C', value: 300 },
  { name: 'D', value: 200 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ModuleDashboardPreview: React.FC<ModuleDashboardPreviewProps> = ({ moduleId }) => {
  // Choose a dashboard based on module ID
  switch (moduleId) {
    case 1: // Employés
      return <EmployeesDashboardPreview />;
    case 2: // Freight
      return <FreightDashboardPreview />;
    case 3: // Projets
      return <ProjectsDashboardPreview />;
    case 5: // Restaurant
      return <RestaurantDashboardPreview />;
    case 9: // Comptabilité
      return <AccountingDashboardPreview />;
    case 10: // E-Commerce
      return <EcommerceDashboardPreview />;
    case 13: // Messages
      return <MessagesDashboardPreview />;
    case 18: // Entreprises
      return <CompaniesDashboardPreview />;
    default:
      return <DefaultDashboardPreview />;
  }
};

// Default dashboard preview for generic modules
const DefaultDashboardPreview = () => (
  <div className="space-y-4 bg-gray-50 p-2 rounded-md">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <StatCard
        title="Total"
        value="42"
        icon={<BarChartIcon className="h-4 w-4 text-blue-500" />}
        description="Éléments actifs"
        className="p-3 text-sm"
      />
      <StatCard
        title="En cours"
        value="12"
        icon={<Activity className="h-4 w-4 text-green-500" />}
        description="Dernière semaine"
        className="p-3 text-sm"
      />
    </div>
    <div className="h-28 bg-white rounded-md p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// Custom dashboard previews for specific modules
const EmployeesDashboardPreview = () => (
  <div className="space-y-4 bg-gray-50 p-2 rounded-md">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <StatCard
        title="Employés"
        value="124"
        icon={<Users className="h-4 w-4 text-blue-500" />}
        description="Total des employés"
        className="p-3 text-sm"
      />
      <StatCard
        title="Présents"
        value="98"
        icon={<Users className="h-4 w-4 text-green-500" />}
        description="Aujourd'hui"
        className="p-3 text-sm"
      />
    </div>
    <div className="h-28 bg-white rounded-md p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={30}
            fill="#8884d8"
            dataKey="value"
            label={false}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const FreightDashboardPreview = () => (
  <div className="space-y-4 bg-gray-50 p-2 rounded-md">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <StatCard
        title="Expéditions"
        value="58"
        icon={<Truck className="h-4 w-4 text-blue-500" />}
        description="En cours"
        className="p-3 text-sm"
      />
      <StatCard
        title="Livraisons"
        value="24"
        icon={<Truck className="h-4 w-4 text-green-500" />}
        description="Aujourd'hui"
        className="p-3 text-sm"
      />
    </div>
    <div className="h-28 bg-white rounded-md p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const ProjectsDashboardPreview = () => (
  <div className="space-y-4 bg-gray-50 p-2 rounded-md">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <StatCard
        title="Projets"
        value="14"
        icon={<BarChartIcon className="h-4 w-4 text-blue-500" />}
        description="Actifs"
        className="p-3 text-sm"
      />
      <StatCard
        title="Tâches"
        value="87"
        icon={<FileText className="h-4 w-4 text-yellow-500" />}
        description="En attente"
        className="p-3 text-sm"
      />
    </div>
    <div className="h-28 bg-white rounded-md p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const RestaurantDashboardPreview = () => (
  <div className="space-y-4 bg-gray-50 p-2 rounded-md">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <StatCard
        title="Ventes"
        value="2,450 €"
        icon={<CreditCard className="h-4 w-4 text-green-500" />}
        description="Aujourd'hui"
        className="p-3 text-sm"
      />
      <StatCard
        title="Commandes"
        value="32"
        icon={<Store className="h-4 w-4 text-blue-500" />}
        description="En cours"
        className="p-3 text-sm"
      />
    </div>
    <div className="h-28 bg-white rounded-md p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AccountingDashboardPreview = () => (
  <div className="space-y-4 bg-gray-50 p-2 rounded-md">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <StatCard
        title="Factures"
        value="12,780 €"
        icon={<CreditCard className="h-4 w-4 text-green-500" />}
        description="En attente"
        className="p-3 text-sm"
      />
      <StatCard
        title="Paiements"
        value="8,450 €"
        icon={<CreditCard className="h-4 w-4 text-blue-500" />}
        description="Ce mois"
        className="p-3 text-sm"
      />
    </div>
    <div className="h-28 bg-white rounded-md p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const EcommerceDashboardPreview = () => (
  <div className="space-y-4 bg-gray-50 p-2 rounded-md">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <StatCard
        title="Ventes"
        value="4,250 €"
        icon={<ShoppingBag className="h-4 w-4 text-green-500" />}
        description="Aujourd'hui"
        className="p-3 text-sm"
      />
      <StatCard
        title="Commandes"
        value="18"
        icon={<ShoppingBag className="h-4 w-4 text-blue-500" />}
        description="Nouvelles"
        className="p-3 text-sm"
      />
    </div>
    <div className="h-28 bg-white rounded-md p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={lineData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const MessagesDashboardPreview = () => (
  <div className="space-y-4 bg-gray-50 p-2 rounded-md">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <StatCard
        title="Messages"
        value="124"
        icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
        description="Non lus"
        className="p-3 text-sm"
      />
      <StatCard
        title="Contacts"
        value="856"
        icon={<Users className="h-4 w-4 text-green-500" />}
        description="Total"
        className="p-3 text-sm"
      />
    </div>
    <div className="h-28 bg-white rounded-md p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const CompaniesDashboardPreview = () => (
  <div className="space-y-4 bg-gray-50 p-2 rounded-md">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <StatCard
        title="Entreprises"
        value="42"
        icon={<Building className="h-4 w-4 text-blue-500" />}
        description="Actives"
        className="p-3 text-sm"
      />
      <StatCard
        title="Contacts"
        value="128"
        icon={<Users className="h-4 w-4 text-green-500" />}
        description="Professionnels"
        className="p-3 text-sm"
      />
    </div>
    <div className="h-28 bg-white rounded-md p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={30}
            fill="#8884d8"
            dataKey="value"
            label={false}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ModuleDashboardPreview;
