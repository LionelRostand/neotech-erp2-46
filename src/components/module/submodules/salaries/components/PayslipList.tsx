
import React, { useState, ChangeEvent } from 'react';
import { useSalarySlipsData } from '@/hooks/useSalarySlipsData';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import PayslipActionMenu from './PayslipActionMenu';

// Define the column structure for the DataTable
const columns = [
  {
    key: "employee",
    header: "Employé",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.employeePhoto && (
          <div className="h-8 w-8 rounded-full overflow-hidden">
            <img 
              src={row.original.employeePhoto} 
              alt={row.original.employeeName} 
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div>{row.original.employeeName}</div>
      </div>
    )
  },
  {
    key: "period",
    header: "Période",
    cell: ({ row }) => `${row.original.month} ${row.original.year}`
  },
  {
    key: "netAmount",
    header: "Montant net",
    cell: ({ row }) => `${row.original.netAmount.toFixed(2)} ${row.original.currency}`
  },
  {
    key: "grossAmount",
    header: "Montant brut",
    cell: ({ row }) => `${row.original.grossAmount.toFixed(2)} ${row.original.currency}`
  },
  {
    key: "status",
    header: "Statut",
    cell: ({ row }) => {
      let badgeClass = "bg-blue-100 text-blue-800";
      
      switch (row.original.status) {
        case "Envoyé":
          badgeClass = "bg-green-100 text-green-800";
          break;
        case "Validé":
          badgeClass = "bg-purple-100 text-purple-800";
          break;
        default:
          badgeClass = "bg-blue-100 text-blue-800";
      }
      
      return <Badge className={badgeClass}>{row.original.status}</Badge>;
    }
  },
  {
    key: "actions",
    header: "Actions",
    cell: ({ row }) => <PayslipActionMenu payslip={row.original} />
  }
];

const PayslipList: React.FC = () => {
  const { salarySlips, stats, isLoading } = useSalarySlipsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSlips, setFilteredSlips] = useState(salarySlips);

  // Handle search input changes
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredSlips(salarySlips);
    } else {
      const filtered = salarySlips.filter(slip => 
        slip.employeeName?.toLowerCase().includes(term) || 
        slip.month.toLowerCase().includes(term) || 
        slip.year.toString().includes(term)
      );
      setFilteredSlips(filtered);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fiches de paie</h2>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 md:gap-6">
        <Card className="w-full md:w-64 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        {/* Add more stats cards here */}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher un employé ou une période..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Actualiser</span>
        </Button>
      </div>

      <DataTable 
        columns={columns}
        data={searchTerm ? filteredSlips : salarySlips}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PayslipList;
