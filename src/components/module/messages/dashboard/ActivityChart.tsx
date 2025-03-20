
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
  data: {
    date: string;
    sent: number;
    received: number;
  }[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-gray-400">
        Aucune donnée d'activité disponible
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' }).format(date);
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return '';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      try {
        const date = new Date(label);
        const formattedDate = new Intl.DateTimeFormat('fr-FR', { 
          day: '2-digit', 
          month: '2-digit',
          year: 'numeric' 
        }).format(date);
        
        return (
          <div className="bg-white p-3 border rounded shadow">
            <p className="font-semibold mb-1">{formattedDate}</p>
            <p className="text-sm text-green-600">
              Envoyés: <span className="font-medium">{payload[0]?.value || 0}</span>
            </p>
            <p className="text-sm text-blue-600">
              Reçus: <span className="font-medium">{payload[1]?.value || 0}</span>
            </p>
          </div>
        );
      } catch (error) {
        console.error('Erreur dans le tooltip:', error);
        return null;
      }
    }
    return null;
  };

  // Vérifier que les données sont valides pour recharts
  const validData = data.map(item => ({
    date: item.date || new Date().toISOString().split('T')[0],
    sent: typeof item.sent === 'number' ? item.sent : 0,
    received: typeof item.received === 'number' ? item.received : 0
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={validData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="sent" 
            name="Messages envoyés" 
            stroke="#10b981" 
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="received" 
            name="Messages reçus" 
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
