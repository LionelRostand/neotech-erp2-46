
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileDown } from 'lucide-react';
import { toast } from 'sonner';

const CompaniesReports: React.FC = () => {
  const [reportType, setReportType] = useState('companies');
  const [dateRange, setDateRange] = useState('month');
  
  // Mock data for charts
  const companiesData = [
    { name: 'Jan', count: 10 },
    { name: 'Fév', count: 15 },
    { name: 'Mar', count: 12 },
    { name: 'Avr', count: 18 },
    { name: 'Mai', count: 22 },
    { name: 'Juin', count: 25 },
  ];
  
  const sectorData = [
    { name: 'Technologie', value: 35 },
    { name: 'Finance', value: 20 },
    { name: 'Santé', value: 15 },
    { name: 'Éducation', value: 10 },
    { name: 'Commerce', value: 15 },
    { name: 'Autre', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#F0E68C'];
  
  const handleExport = (format: 'pdf' | 'excel') => {
    toast.success(`Rapport exporté en format ${format.toUpperCase()}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Rapports</h2>
          <p className="text-gray-500">Analyses et statistiques sur les entreprises</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <FileDown className="h-4 w-4 mr-2" />
            Exporter Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Type de rapport</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="companies">Nouvelles entreprises</SelectItem>
                  <SelectItem value="sectors">Répartition par secteur</SelectItem>
                  <SelectItem value="contacts">Contacts par entreprise</SelectItem>
                  <SelectItem value="activity">Activité des entreprises</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateRange">Période</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Dernière semaine</SelectItem>
                  <SelectItem value="month">Dernier mois</SelectItem>
                  <SelectItem value="quarter">Dernier trimestre</SelectItem>
                  <SelectItem value="year">Dernière année</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input id="startDate" type="date" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input id="endDate" type="date" />
            </div>
            
            <Button className="w-full">Générer le rapport</Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {reportType === 'companies' && 'Nouvelles entreprises par mois'}
              {reportType === 'sectors' && 'Répartition des entreprises par secteur'}
              {reportType === 'contacts' && 'Nombre de contacts par entreprise'}
              {reportType === 'activity' && 'Activité des entreprises'}
            </h3>
            
            {reportType === 'companies' && (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companiesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Nombre d'entreprises" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {reportType === 'sectors' && (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} entreprises`, 'Nombre']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {(reportType === 'contacts' || reportType === 'activity') && (
              <div className="flex justify-center items-center h-[400px] border border-dashed rounded-md">
                <p className="text-gray-500">Les données pour ce rapport ne sont pas encore disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompaniesReports;
