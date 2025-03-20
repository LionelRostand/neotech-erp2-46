
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Données de démonstration
const data = [
  { name: 'Jan', consultations: 40, hospitalisations: 24 },
  { name: 'Fév', consultations: 35, hospitalisations: 13 },
  { name: 'Mar', consultations: 50, hospitalisations: 22 },
  { name: 'Avr', consultations: 65, hospitalisations: 27 },
  { name: 'Mai', consultations: 60, hospitalisations: 25 },
  { name: 'Juin', consultations: 75, hospitalisations: 32 },
  { name: 'Juil', consultations: 85, hospitalisations: 28 },
];

const PatientsChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="consultations" 
            stroke="#4f46e5" 
            strokeWidth={2} 
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="hospitalisations" 
            stroke="#f97316" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatientsChart;
