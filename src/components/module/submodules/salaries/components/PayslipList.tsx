
import React, { useState } from 'react';
import { useSalarySlipsData } from '@/hooks/useSalarySlipsData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Search, Printer, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PayslipDetails from './PayslipDetails';
import { PaySlip } from '@/types/payslip';
import { Badge } from '@/components/ui/badge';

const PayslipList = () => {
  const { salarySlips, isLoading, error } = useSalarySlipsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<PaySlip | null>(null);
  
  // Get unique years and months for filtering
  const years = [...new Set(salarySlips.map(slip => slip.year))].sort((a, b) => b - a);
  const months = [...new Set(salarySlips.map(slip => slip.month))].sort();
  
  // Filter payslips based on search term and filters
  const filteredPayslips = salarySlips.filter(slip => {
    const matchesSearch = 
      slip.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slip.department?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesMonth = filterMonth ? slip.month === filterMonth : true;
    const matchesYear = filterYear ? slip.year === parseInt(filterYear) : true;
    
    return matchesSearch && matchesMonth && matchesYear;
  });
  
  const handleViewPayslip = (payslip: any) => {
    setSelectedPayslip(payslip);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <p>Chargement des fiches de paie...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">Erreur lors du chargement des fiches de paie</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Généré': return 'bg-blue-100 text-blue-800';
      case 'Envoyé': return 'bg-amber-100 text-amber-800';
      case 'Validé': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des fiches de paie</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un employé ou un département..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Mois" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les mois</SelectItem>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les années</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Payslips list */}
        {filteredPayslips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium">Aucune fiche de paie trouvée</h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchTerm || filterMonth || filterYear 
                ? "Essayez d'ajuster vos filtres"
                : "Aucune fiche de paie n'a encore été générée"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">Employé</th>
                  <th className="py-3 text-left">Département</th>
                  <th className="py-3 text-left">Période</th>
                  <th className="py-3 text-right">Montant Net</th>
                  <th className="py-3 text-center">Statut</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayslips.map((payslip) => (
                  <tr key={payslip.id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center">
                        {payslip.employeePhoto ? (
                          <img 
                            src={payslip.employeePhoto} 
                            alt={payslip.employeeName} 
                            className="w-8 h-8 rounded-full mr-2 object-cover" 
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                            {payslip.employeeName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <span>{payslip.employeeName}</span>
                      </div>
                    </td>
                    <td className="py-3">{payslip.department || 'Non spécifié'}</td>
                    <td className="py-3">{payslip.month} {payslip.year}</td>
                    <td className="py-3 text-right">{payslip.netAmount?.toLocaleString('fr-FR')} €</td>
                    <td className="py-3">
                      <div className="flex justify-center">
                        <Badge variant="outline" className={getStatusColor(payslip.status)}>
                          {payslip.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleViewPayslip(payslip)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Fiche de paie - {payslip.employeeName}</DialogTitle>
                            </DialogHeader>
                            {selectedPayslip && <PayslipDetails payslip={selectedPayslip} />}
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="ghost" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PayslipList;
