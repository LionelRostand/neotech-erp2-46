
import React, { useState } from 'react';
import { useLeaveBalances } from '@/hooks/useLeaveBalances';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const LeaveBalances: React.FC = () => {
  const { leaveBalances, isLoading, error } = useLeaveBalances();
  const { departments } = useHrModuleData();
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="ml-2 text-gray-500">Chargement des soldes de congés...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Une erreur est survenue lors du chargement des soldes de congés.
      </div>
    );
  }
  
  // Get unique leave types
  const leaveTypes = Array.from(new Set(leaveBalances.map(b => b.type)));
  
  // Get unique employee IDs to avoid duplicates in the table
  const uniqueEmployeeIds = Array.from(new Set(leaveBalances.map(b => b.employeeId)));
  
  // Filter balances based on department, type, and search query
  const filteredBalances = leaveBalances.filter(balance => {
    const matchesDepartment = departmentFilter === 'all' || balance.department === departmentFilter;
    const matchesType = typeFilter === 'all' || balance.type === typeFilter;
    const matchesSearch = searchQuery === '' || 
      balance.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      balance.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesDepartment && matchesType && matchesSearch;
  });
  
  // Group balances by employee
  const employeeBalances = uniqueEmployeeIds
    .map(empId => {
      const empBalances = filteredBalances.filter(b => b.employeeId === empId);
      // Only include employees that match the filters
      return empBalances.length > 0 ? empBalances : null;
    })
    .filter(Boolean);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par nom ou département"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tous les départements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les départements</SelectItem>
                {departments?.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {leaveTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {employeeBalances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun résultat pour les filtres sélectionnés
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Département</TableHead>
                  {typeFilter === 'all' && <TableHead>Type de congé</TableHead>}
                  <TableHead>Total</TableHead>
                  <TableHead>Utilisé</TableHead>
                  <TableHead>Restant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeBalances.flatMap((empBalances: any) => {
                  // If type filter is applied, only show one row per employee
                  if (typeFilter !== 'all') {
                    const balance = empBalances.find(b => b.type === typeFilter) || empBalances[0];
                    return (
                      <TableRow key={`${balance.employeeId}-${balance.type}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={balance.employeePhoto} alt={balance.employeeName} />
                              <AvatarFallback>{balance.employeeName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{balance.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{balance.department}</TableCell>
                        <TableCell>{balance.total}</TableCell>
                        <TableCell>{balance.used}</TableCell>
                        <TableCell className="font-semibold">{balance.remaining}</TableCell>
                        <TableCell>
                          <Badge variant={balance.remaining > 5 ? 'success' : balance.remaining > 0 ? 'warning' : 'destructive'}>
                            {balance.remaining > 5 ? 'Bon' : balance.remaining > 0 ? 'Attention' : 'Épuisé'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  
                  // If no type filter, show a row for each leave type
                  return empBalances.map((balance, idx) => (
                    <TableRow key={`${balance.employeeId}-${balance.type}`}>
                      {idx === 0 && (
                        <TableCell className="font-medium" rowSpan={empBalances.length}>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={balance.employeePhoto} alt={balance.employeeName} />
                              <AvatarFallback>{balance.employeeName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{balance.employeeName}</span>
                          </div>
                        </TableCell>
                      )}
                      {idx === 0 && (
                        <TableCell rowSpan={empBalances.length}>{balance.department}</TableCell>
                      )}
                      <TableCell>{balance.type}</TableCell>
                      <TableCell>{balance.total}</TableCell>
                      <TableCell>{balance.used}</TableCell>
                      <TableCell className="font-semibold">{balance.remaining}</TableCell>
                      <TableCell>
                        <Badge variant={balance.remaining > 5 ? 'success' : balance.remaining > 0 ? 'warning' : 'destructive'}>
                          {balance.remaining > 5 ? 'Bon' : balance.remaining > 0 ? 'Attention' : 'Épuisé'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ));
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
