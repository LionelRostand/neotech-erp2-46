
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the revenue chart
const data = [
  { date: '01/06', revenue: 1200 },
  { date: '02/06', revenue: 1400 },
  { date: '03/06', revenue: 1300 },
  { date: '04/06', revenue: 1500 },
  { date: '05/06', revenue: 1350 },
  { date: '06/06', revenue: 1700 },
  { date: '07/06', revenue: 1850 },
  { date: '08/06', revenue: 2000 },
  { date: '09/06', revenue: 1900 },
  { date: '10/06', revenue: 2200 },
  { date: '11/06', revenue: 2100 },
  { date: '12/06', revenue: 2300 },
  { date: '13/06', revenue: 2400 },
  { date: '14/06', revenue: 2600 },
  { date: '15/06', revenue: 2500 },
  { date: '16/06', revenue: 2700 },
  { date: '17/06', revenue: 2400 },
  { date: '18/06', revenue: 2800 },
  { date: '19/06', revenue: 2900 },
  { date: '20/06', revenue: 3000 },
  { date: '21/06', revenue: 2800 },
  { date: '22/06', revenue: 2600 },
  { date: '23/06', revenue: 2700 },
  { date: '24/06', revenue: 2900 },
  { date: '25/06', revenue: 3100 },
  { date: '26/06', revenue: 3000 },
  { date: '27/06', revenue: 3200 },
  { date: '28/06', revenue: 3400 },
  { date: '29/06', revenue: 3300 },
  { date: '30/06', revenue: 3500 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-md border">
        <p className="font-semibold">{label}</p>
        <p className="text-blue-600">{`${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
};

export const RevenueChart = () => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis 
            tickFormatter={(value) => `${value}€`} 
            tickLine={false} 
            axisLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#6366f1" 
            strokeWidth={3} 
            dot={false} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
