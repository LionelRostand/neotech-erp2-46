
import React from 'react';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const DriverAvailability = () => {
  // Données fictives pour la disponibilité
  const availabilityData = [
    { name: 'Disponible', value: 10, color: '#22c55e' },
    { name: 'En service', value: 6, color: '#3b82f6' },
    { name: 'Hors service', value: 4, color: '#6b7280' },
    { name: 'Congés', value: 3, color: '#a855f7' },
    { name: 'Maladie', value: 3, color: '#eab308' },
  ];
  
  // Prévisions de disponibilité
  const availabilityForecast = [
    { day: 'Lundi', available: 16, total: 26, percentage: 62 },
    { day: 'Mardi', available: 18, total: 26, percentage: 69 },
    { day: 'Mercredi', available: 20, total: 26, percentage: 77 },
    { day: 'Jeudi', available: 19, total: 26, percentage: 73 },
    { day: 'Vendredi', available: 22, total: 26, percentage: 85 },
    { day: 'Samedi', available: 15, total: 26, percentage: 58 },
    { day: 'Dimanche', available: 14, total: 26, percentage: 54 },
  ];
  
  // Chauffeurs en congés
  const leavingDrivers = [
    { id: "DRV-005", name: "Julie Leroy", startDate: "2023-07-15", endDate: "2023-07-28", type: "vacation" },
    { id: "DRV-002", name: "Sophie Martin", startDate: "2023-07-18", endDate: "2023-07-19", type: "training" },
    { id: "DRV-007", name: "Camille Dubois", startDate: "2023-07-14", endDate: "2023-07-21", type: "sick" },
    { id: "DRV-003", name: "Nicolas Durand", startDate: "2023-07-19", endDate: "2023-07-26", type: "vacation" },
    { id: "DRV-008", name: "Luc Bernard", startDate: "2023-07-22", endDate: "2023-07-23", type: "personal" },
  ];
  
  // Obtenir le badge pour le type d'absence
  const getLeaveTypeBadge = (type: string) => {
    switch (type) {
      case "vacation":
        return <Badge className="bg-purple-500">Congés payés</Badge>;
      case "sick":
        return <Badge className="bg-yellow-500">Arrêt maladie</Badge>;
      case "training":
        return <Badge className="bg-blue-500">Formation</Badge>;
      case "personal":
        return <Badge className="bg-orange-500">Congé personnel</Badge>;
      default:
        return <Badge>Absence</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Statut actuel des chauffeurs</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={availabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {availabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Chauffeurs']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Prévisions de disponibilité</h3>
          <div className="space-y-3">
            {availabilityForecast.map((day) => (
              <div key={day.day}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{day.day}</span>
                  <span className="text-muted-foreground">{day.available}/{day.total} chauffeurs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${day.percentage >= 70 ? 'bg-green-500' : day.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${day.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Absences prévues</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chauffeur</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Durée</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leavingDrivers.map((driver) => {
                const startDate = new Date(driver.startDate);
                const endDate = new Date(driver.endDate);
                const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;
                
                return (
                  <TableRow key={driver.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{driver.name}</p>
                        <p className="text-xs text-muted-foreground">{driver.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{new Date(driver.startDate).toLocaleDateString('fr-FR')}</p>
                        <p className="text-xs text-muted-foreground">au {new Date(driver.endDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getLeaveTypeBadge(driver.type)}</TableCell>
                    <TableCell>{durationDays} jour{durationDays > 1 ? 's' : ''}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default DriverAvailability;
