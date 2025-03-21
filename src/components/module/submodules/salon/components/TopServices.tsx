
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TopServices: React.FC = () => {
  const services = [
    { name: "Coupe & Brushing", count: 124, percentage: 27, revenue: 3720 },
    { name: "Coloration", count: 86, percentage: 19, revenue: 5160 },
    { name: "Balayage", count: 62, percentage: 14, revenue: 4340 },
    { name: "Coupe Homme", count: 78, percentage: 17, revenue: 1560 },
    { name: "Mèches", count: 46, percentage: 10, revenue: 3220 },
    { name: "Coupe & Barbe", count: 38, percentage: 8, revenue: 1330 },
    { name: "Autres", count: 23, percentage: 5, revenue: 920 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Services les plus populaires</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2 text-right">Rendez-vous</th>
                  <th className="px-4 py-2 text-right">Pourcentage</th>
                  <th className="px-4 py-2 text-right">Revenu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {services.map((service, index) => (
                  <tr key={index} className="text-sm text-gray-700">
                    <td className="px-4 py-3">{service.name}</td>
                    <td className="px-4 py-3 text-right">{service.count}</td>
                    <td className="px-4 py-3 text-right">{service.percentage}%</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(service.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopServices;
