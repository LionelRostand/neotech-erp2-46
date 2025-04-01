import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LineChart from "@/components/ui/line-chart"; // Fixed import
import { Download, Filter, PlusCircle, Search } from "lucide-react";

const TransportPayments = () => {
  const [selectedMonth, setSelectedMonth] = useState("this-month");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for demonstration
  const paymentData = [
    { date: "2023-01-01", amount: 150 },
    { date: "2023-01-08", amount: 200 },
    { date: "2023-01-15", amount: 180 },
    { date: "2023-01-22", amount: 220 },
    { date: "2023-01-29", amount: 250 },
    { date: "2023-02-05", amount: 190 },
    { date: "2023-02-12", amount: 210 },
    { date: "2023-02-19", amount: 230 },
    { date: "2023-02-26", amount: 260 },
    { date: "2023-03-05", amount: 200 },
    { date: "2023-03-12", amount: 240 },
    { date: "2023-03-19", amount: 270 },
    { date: "2023-03-26", amount: 210 },
  ];

  // Transform data for the chart
  const chartData = paymentData.map((item) => ({
    name: item.date,
    Amount: item.amount,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Paiements</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="ghost" size="icon">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Aperçu des paiements</CardTitle>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ce mois-ci" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">Ce mois-ci</SelectItem>
              <SelectItem value="last-month">Mois dernier</SelectItem>
              <SelectItem value="this-year">Cette année</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <LineChart data={chartData} xKey="name" yKey="Amount" color="#4ade80" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Liste des paiements</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 peer-focus:text-gray-900 dark:text-gray-400 dark:peer-focus:text-gray-100" />
              <Input
                placeholder="Rechercher un paiement..."
                className="w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mock table for payments */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                {paymentData.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {payment.amount} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      Carte de crédit
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      Réussi
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportPayments;
