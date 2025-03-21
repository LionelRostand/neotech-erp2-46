
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DriverPerformance = () => {
  // Données fictives pour le graphique de performance
  const performanceData = [
    { name: 'Jan', trajets: 24, evaluations: 4.7 },
    { name: 'Fév', trajets: 28, evaluations: 4.8 },
    { name: 'Mar', trajets: 32, evaluations: 4.6 },
    { name: 'Avr', trajets: 26, evaluations: 4.9 },
    { name: 'Mai', trajets: 30, evaluations: 4.7 },
    { name: 'Juin', trajets: 35, evaluations: 4.8 },
    { name: 'Juil', trajets: 38, evaluations: 4.7 },
    { name: 'Août', trajets: 29, evaluations: 4.6 },
    { name: 'Sep', trajets: 33, evaluations: 4.8 },
    { name: 'Oct', trajets: 36, evaluations: 4.9 },
    { name: 'Nov', trajets: 31, evaluations: 4.7 },
    { name: 'Déc', trajets: 27, evaluations: 4.8 },
  ];

  // Statistiques de performance
  const topDrivers = [
    { name: "Pierre Moreau", trips: 310, rating: 4.9 },
    { name: "Marc Leblanc", trips: 238, rating: 4.8 },
    { name: "Thomas Petit", trips: 220, rating: 4.4 },
    { name: "Sophie Martin", trips: 192, rating: 4.7 },
    { name: "Camille Dubois", trips: 198, rating: 4.8 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Évaluation moyenne</h3>
          <div className="text-4xl font-bold text-blue-600">4.7</div>
          <p className="text-sm text-muted-foreground mt-2">+0.2 depuis le trimestre précédent</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Trajets mensuels</h3>
          <div className="text-4xl font-bold text-green-600">205</div>
          <p className="text-sm text-muted-foreground mt-2">+12% depuis le mois dernier</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Taux de satisfaction</h3>
          <div className="text-4xl font-bold text-purple-600">92%</div>
          <p className="text-sm text-muted-foreground mt-2">Basé sur 478 avis clients</p>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Performance mensuelle</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" domain={[4, 5]} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="trajets" name="Nombre de trajets" fill="#60a5fa" />
              <Bar yAxisId="right" dataKey="evaluations" name="Évaluation moyenne" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Meilleurs chauffeurs</h3>
        <div className="space-y-4">
          {topDrivers.map((driver, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <span className="font-medium">{driver.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-sm text-muted-foreground">Trajets</span>
                  <p className="font-medium">{driver.trips}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Note</span>
                  <p className="font-medium">{driver.rating} <span className="text-yellow-500">★</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DriverPerformance;
