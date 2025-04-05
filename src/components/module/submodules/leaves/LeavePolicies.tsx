
import React, { useState } from 'react';
import { useLeaveBalances } from '@/hooks/useLeaveBalances';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export const LeavePolicies: React.FC = () => {
  const { leaveBalances, isLoading, error } = useLeaveBalances();
  const { employees } = useHrModuleData();
  const [employeeId, setEmployeeId] = useState<string>('all');
  const [policyTab, setPolicyTab] = useState<string>('policies');
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2 text-gray-500">Chargement des politiques de congés...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Une erreur est survenue lors du chargement des politiques de congés.
      </div>
    );
  }
  
  // Standard leave policies
  const leavePolicies = [
    { 
      type: 'Congés payés', 
      days: 25, 
      carryOver: true, 
      maxCarryOver: 10, 
      description: 'Congés annuels standard pour tous les employés à temps plein' 
    },
    { 
      type: 'RTT', 
      days: 12, 
      carryOver: false, 
      maxCarryOver: 0, 
      description: 'Réduction du temps de travail, variable selon les accords d\'entreprise' 
    },
    { 
      type: 'Congé maladie', 
      days: -1, 
      carryOver: false, 
      maxCarryOver: 0, 
      description: 'Congés en cas de maladie, soumis à justificatif médical' 
    },
    { 
      type: 'Congé exceptionnel', 
      days: 5, 
      carryOver: false, 
      maxCarryOver: 0, 
      description: 'Événements familiaux (mariage, naissance, décès...)' 
    },
    { 
      type: 'Congé sans solde', 
      days: -1, 
      carryOver: false, 
      maxCarryOver: 0, 
      description: 'Période d\'absence non rémunérée accordée sous conditions' 
    },
  ];
  
  // Filter balances by employee if selected
  const filteredBalances = employeeId === 'all' 
    ? leaveBalances 
    : leaveBalances.filter(balance => balance.employeeId === employeeId);
  
  // Group balances by employee for the attribution view
  const balancesByEmployee = filteredBalances.reduce((acc, balance) => {
    if (!acc[balance.employeeId]) {
      acc[balance.employeeId] = [];
    }
    acc[balance.employeeId].push(balance);
    return acc;
  }, {});
  
  return (
    <div className="space-y-6">
      <Tabs value={policyTab} onValueChange={setPolicyTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="policies">Politiques générales</TabsTrigger>
            <TabsTrigger value="attribution">Attribution par employé</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="employee-filter" className="sr-only">Filtrer par employé</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger id="employee-filter" className="w-[200px]">
                <SelectValue placeholder="Tous les employés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les employés</SelectItem>
                {employees?.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Politiques de congés</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type de congé</TableHead>
                    <TableHead>Jours par an</TableHead>
                    <TableHead>Report autorisé</TableHead>
                    <TableHead>Maximum reportable</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leavePolicies.map((policy, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{policy.type}</TableCell>
                      <TableCell>{policy.days === -1 ? 'Illimité' : policy.days}</TableCell>
                      <TableCell>
                        <Badge variant={policy.carryOver ? 'success' : 'destructive'}>
                          {policy.carryOver ? 'Oui' : 'Non'}
                        </Badge>
                      </TableCell>
                      <TableCell>{policy.carryOver ? policy.maxCarryOver : '-'}</TableCell>
                      <TableCell>{policy.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attribution">
          <Card>
            <CardHeader>
              <CardTitle>Attribution des congés par employé</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(balancesByEmployee).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune donnée disponible pour les filtres sélectionnés
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(balancesByEmployee).map(([empId, balances]: [string, any[]]) => {
                    const employee = employees?.find(e => e.id === empId);
                    if (!employee) return null;
                    
                    return (
                      <div key={empId} className="border rounded-lg p-4">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={employee.photoURL || employee.photo} alt={`${employee.firstName} ${employee.lastName}`} />
                            <AvatarFallback>{employee.firstName?.[0]}{employee.lastName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{employee.firstName} {employee.lastName}</h3>
                            <p className="text-sm text-gray-500">{employee.position || employee.role}</p>
                          </div>
                        </div>
                        
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type de congé</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Utilisé</TableHead>
                              <TableHead>Reste</TableHead>
                              <TableHead>Pourcentage utilisé</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {balances.map((balance, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{balance.type}</TableCell>
                                <TableCell>{balance.total}</TableCell>
                                <TableCell>{balance.used}</TableCell>
                                <TableCell className="font-semibold">{balance.remaining}</TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                      <div 
                                        className="bg-blue-600 h-2.5 rounded-full" 
                                        style={{ width: `${Math.min(100, Math.round((balance.used / balance.total) * 100))}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs">
                                      {Math.round((balance.used / balance.total) * 100)}%
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
