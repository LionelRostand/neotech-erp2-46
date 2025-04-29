import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FileText, Search, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import EmployeesDashboardCards from './EmployeesDashboardCards';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { exportEmployeePdf } from './utils/employeePdfUtils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const EmployeesDashboard = () => {
  const navigate = useNavigate();
  const { employees = [], isLoading } = useEmployeeData();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) => 
    employee.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    employee.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    employee.position?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    employee.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
      case 'Actif':
        return <Badge className="bg-green-500 hover:bg-green-600">Actif</Badge>;
      case 'inactive':
      case 'Inactif':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Inactif</Badge>;
      case 'onLeave':
      case 'En congé':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">En congé</Badge>;
      case 'Suspendu':
        return <Badge className="bg-red-500 hover:bg-red-600">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  // Helper to get employee initials for avatar fallback
  const getInitials = (employee: any) => {
    return `${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`;
  };

  // Handle export to PDF
  const handleExportPdf = (employee) => {
    try {
      const success = exportEmployeePdf(employee);
      if (success) {
        toast.success(`Fiche de ${employee.firstName} ${employee.lastName} exportée en PDF`);
      } else {
        toast.error("Erreur lors de l'exportation du PDF");
      }
    } catch (error) {
      console.error('Export PDF error:', error);
      toast.error("Erreur lors de l'exportation du PDF");
    }
  };

  // Handle view employee details
  const handleViewEmployee = (employee) => {
    navigate(`/modules/employees/profiles/${employee.id}`);
  };

  // Table columns
  const columns = [
    {
      header: "Nom",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={employee.photoURL || employee.photo} 
                alt={`${employee.firstName} ${employee.lastName}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(employee)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{employee.firstName} {employee.lastName}</div>
              <div className="text-xs text-muted-foreground">{employee.position}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: "Département",
      cell: ({ row }) => row.original.department || 'Non spécifié'
    },
    {
      header: "Email",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div>
            <div>{employee.professionalEmail || employee.email}</div>
            {employee.professionalEmail && employee.email !== employee.professionalEmail && (
              <div className="text-xs text-muted-foreground">{employee.email}</div>
            )}
          </div>
        );
      }
    },
    {
      header: "Date d'embauche",
      cell: ({ row }) => formatDate(row.original.hireDate)
    },
    {
      header: "Statut",
      cell: ({ row }) => getStatusBadge(row.original.status)
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewEmployee(row.original)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleExportPdf(row.original)}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord des employés</h1>
        <Button onClick={() => navigate('/modules/employees/profiles')}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un employé
        </Button>
      </div>
      
      <EmployeesDashboardCards />
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Derniers employés</h2>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Rechercher un employé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <DataTable
          columns={columns}
          data={filteredEmployees}
          isLoading={isLoading}
          emptyMessage="Aucun employé trouvé"
          onRowClick={handleViewEmployee}
        />
      </Card>
    </div>
  );
};

export default EmployeesDashboard;
