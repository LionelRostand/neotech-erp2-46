
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { useLeaveBalances } from '@/hooks/useLeaveBalances';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const LeavePolicies: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('policies');
  
  const { employees, isLoading: isEmployeesLoading } = useHrModuleData();
  const { leaveBalances, isLoading: isBalancesLoading } = useLeaveBalances(selectedEmployee !== 'all' ? selectedEmployee : undefined);

  // Dans une application réelle, ces données viendraient de Firebase
  const policies = [
    {
      id: '1',
      title: 'Congés payés',
      summary: '25 jours par an pour tous les employés à temps plein',
      details: `
        Chaque employé à temps plein a droit à 25 jours de congés payés par année civile.
        Les congés sont acquis à raison de 2,08 jours par mois travaillé.
        Les demandes doivent être soumises au moins 2 semaines à l'avance.
        La période de référence s'étend du 1er janvier au 31 décembre.
        Les jours de congés non pris peuvent être reportés jusqu'au 31 mars de l'année suivante.
      `
    },
    {
      id: '2',
      title: 'RTT (Réduction du Temps de Travail)',
      summary: '12 jours par an pour les employés sur base 39h',
      details: `
        Les salariés travaillant 39h par semaine bénéficient de 12 jours de RTT par an.
        Les RTT sont acquis dès le début de l'année civile.
        50% des jours de RTT sont à la libre disposition du salarié, 50% sont fixés par l'employeur.
        Les RTT non pris au 31 décembre sont perdus sauf accord spécifique.
      `
    },
    {
      id: '3',
      title: 'Congés exceptionnels',
      summary: 'Accordés pour événements familiaux et personnels',
      details: `
        Mariage/PACS du salarié : 4 jours ouvrables
        Mariage d'un enfant : 1 jour ouvrable
        Naissance ou adoption : 3 jours ouvrables
        Décès du conjoint ou d'un enfant : 5 jours ouvrables
        Décès d'un parent : 3 jours ouvrables
        Décès d'un grand-parent, frère, sœur : 1 jour ouvrable
        Déménagement : 1 jour ouvrable par an
      `
    },
    {
      id: '4',
      title: 'Congés maladie',
      summary: 'Indemnisation selon ancienneté après 1 an',
      details: `
        Tout arrêt maladie doit être justifié par un certificat médical envoyé dans les 48h.
        Après 1 an d'ancienneté, maintien du salaire selon les conditions suivantes :
        - De 1 à 5 ans d'ancienneté : 30 jours à 90% puis 30 jours à 66%
        - De 6 à 10 ans d'ancienneté : 40 jours à 90% puis 40 jours à 66%
        - Plus de 10 ans d'ancienneté : 60 jours à 90% puis 60 jours à 66%
      `
    },
    {
      id: '5',
      title: 'Congés sans solde',
      summary: 'Possible après accord de la direction',
      details: `
        Les congés sans solde sont accordés à la discrétion de la direction.
        La demande doit être soumise au moins 1 mois à l'avance.
        La durée maximale est de 3 mois, renouvelable une fois.
        Pendant cette période, le contrat de travail est suspendu.
        L'employé ne perçoit pas de salaire et n'acquiert pas de congés payés.
        Le retour est garanti sur le même poste ou un poste équivalent.
      `
    }
  ];

  const isLoading = isEmployeesLoading || isBalancesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        <p className="ml-2 text-gray-500">Chargement des politiques de congés...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold mb-2">Politiques de congés</h3>
          <p className="text-gray-600 mb-4">
            Consultez les différents types de congés et les règles associées
          </p>
        </div>

        <div className="w-64">
          <Select
            value={selectedEmployee}
            onValueChange={setSelectedEmployee}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un employé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {employees.map(employee => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.firstName} {employee.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="policies">Politiques générales</TabsTrigger>
          <TabsTrigger value="application">Application par employé</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="pt-4">
          <Accordion type="single" collapsible className="w-full">
            {policies.map((policy) => (
              <AccordionItem key={policy.id} value={policy.id}>
                <AccordionTrigger className="hover:bg-gray-50 px-4">
                  <div className="text-left">
                    <div className="font-medium">{policy.title}</div>
                    <div className="text-sm text-gray-500">{policy.summary}</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4 text-gray-700 whitespace-pre-line">
                  {policy.details}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
            <h4 className="text-blue-800 font-medium mb-2">Note importante</h4>
            <p className="text-blue-700 text-sm">
              Ces politiques sont susceptibles d'évoluer. Veuillez consulter le département RH pour toute question spécifique concernant vos droits à congés.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="application" className="pt-4">
          <Card>
            <CardContent className="p-6">
              {selectedEmployee === 'all' ? (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    Veuillez sélectionner un employé pour voir l'application des politiques de congés à son cas particulier.
                  </p>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Employé</TableHead>
                        <TableHead>Type de congé</TableHead>
                        <TableHead>Droits annuels</TableHead>
                        <TableHead>Utilisés</TableHead>
                        <TableHead>Solde</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.slice(0, 5).map(employee => {
                        const employeeBalances = leaveBalances.filter(
                          balance => balance.employeeId === employee.id
                        );
                        
                        if (employeeBalances.length === 0) {
                          return (
                            <TableRow key={employee.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={employee.photoURL} alt={`${employee.firstName} ${employee.lastName}`} />
                                    <AvatarFallback>{`${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{`${employee.firstName} ${employee.lastName}`}</p>
                                    <p className="text-xs text-gray-500">{employee.department}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell colSpan={4} className="text-center text-gray-500">
                                Aucun solde de congés défini
                              </TableCell>
                            </TableRow>
                          );
                        }
                        
                        return employeeBalances.map((balance, index) => (
                          <TableRow key={`${employee.id}-${balance.type}`}>
                            {index === 0 ? (
                              <TableCell rowSpan={employeeBalances.length} className="align-top">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={employee.photoURL} alt={`${employee.firstName} ${employee.lastName}`} />
                                    <AvatarFallback>{`${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{`${employee.firstName} ${employee.lastName}`}</p>
                                    <p className="text-xs text-gray-500">{employee.department}</p>
                                  </div>
                                </div>
                              </TableCell>
                            ) : null}
                            <TableCell>{balance.type}</TableCell>
                            <TableCell>{balance.total} jours</TableCell>
                            <TableCell>{balance.used} jours</TableCell>
                            <TableCell>{balance.remaining} jours</TableCell>
                          </TableRow>
                        ));
                      })}
                    </TableBody>
                  </Table>
                  
                  {employees.length > 5 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" size="sm">
                        Voir tous les employés
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Employee details view */}
                  {(() => {
                    const employee = employees.find(emp => emp.id === selectedEmployee);
                    const employeeBalances = leaveBalances.filter(
                      balance => balance.employeeId === selectedEmployee
                    );
                    
                    if (!employee) {
                      return <p>Employé non trouvé</p>;
                    }
                    
                    return (
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={employee.photoURL} alt={`${employee.firstName} ${employee.lastName}`} />
                            <AvatarFallback className="text-lg">{`${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-xl font-semibold">{employee.firstName} {employee.lastName}</h3>
                            <p className="text-gray-600">{employee.department}</p>
                            <p className="text-gray-600">{employee.position || employee.title || 'Non spécifié'}</p>
                            <p className="text-sm text-gray-500">Date d'embauche: {new Date(employee.hireDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Soldes de congés</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {employeeBalances.map(balance => (
                              <Card key={balance.type} className={
                                balance.remaining > balance.total * 0.5 
                                  ? "bg-green-50 border-green-100" 
                                  : balance.remaining > 0 
                                    ? "bg-yellow-50 border-yellow-100" 
                                    : "bg-red-50 border-red-100"
                              }>
                                <CardContent className="p-4">
                                  <h5 className="font-medium">{balance.type}</h5>
                                  <div className="mt-2 text-3xl font-bold">
                                    {balance.remaining}
                                    <span className="text-sm font-normal text-gray-600"> / {balance.total} jours</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{balance.used} jours utilisés</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Politiques applicables</h4>
                          
                          <Accordion type="single" collapsible className="w-full">
                            {policies.map((policy) => {
                              // Find if we have a balance for this policy type
                              const balance = employeeBalances.find(b => b.type === policy.title);
                              
                              return (
                                <AccordionItem key={policy.id} value={policy.id}>
                                  <AccordionTrigger className="hover:bg-gray-50 px-4">
                                    <div className="text-left flex-1 flex justify-between pr-4">
                                      <div>
                                        <div className="font-medium">{policy.title}</div>
                                        <div className="text-sm text-gray-500">{policy.summary}</div>
                                      </div>
                                      {balance && (
                                        <div className="text-right">
                                          <div className="font-medium">{balance.remaining} / {balance.total}</div>
                                          <div className="text-sm text-gray-500">jours disponibles</div>
                                        </div>
                                      )}
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="px-4 pt-2 pb-4 text-gray-700">
                                    <div className="whitespace-pre-line mb-4">
                                      {policy.details}
                                    </div>
                                    
                                    {balance && (
                                      <div className="bg-gray-100 p-3 rounded-md">
                                        <p className="text-sm font-medium">Application pour {employee.firstName} {employee.lastName}</p>
                                        <p className="text-sm mt-1">
                                          Droits annuels: <strong>{balance.total} jours</strong>
                                          <br/>
                                          Congés pris: <strong>{balance.used} jours</strong>
                                          <br/>
                                          Solde disponible: <strong>{balance.remaining} jours</strong>
                                        </p>
                                      </div>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
