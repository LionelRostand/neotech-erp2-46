
import React from "react";
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  showGrid?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  width = "100%",
  height = 300,
  color = "#0284c7",
  showGrid = true
}) => {
  if (!data || data.length === 0) {
    return <div className="flex justify-center items-center h-[300px] text-gray-400">No data available</div>;
  }

  return (
    <div>
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      <ResponsiveContainer width={width} height={height}>
        <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} stroke={color} activeDot={{ r: 8 }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
