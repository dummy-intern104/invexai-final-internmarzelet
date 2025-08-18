
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface LineChartProps {
  data: any[];
  dataKey?: string; // Made optional to maintain compatibility
  xAxisDataKey?: string;
  stroke?: string;
  title?: string;
  // Adding these props to support the current usage in ClientDetail.tsx
  xKey?: string;
  yKey?: string;
  color?: string;
}

export const LineChart = ({ 
  data, 
  dataKey = "value", // Default value for backward compatibility
  xAxisDataKey = "name", 
  stroke = "#4f46e5",
  title,
  // Support new prop format while maintaining backward compatibility
  xKey,
  yKey,
  color
}: LineChartProps) => {
  // Use the new props if provided, otherwise use the original ones
  const actualDataKey = yKey || dataKey;
  const actualXAxisDataKey = xKey || xAxisDataKey;
  const actualStroke = color || stroke;

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey={actualXAxisDataKey} 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: 8, 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={actualDataKey} 
              stroke={actualStroke} 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
              animationDuration={1500}
              dot={{ stroke: actualStroke, strokeWidth: 2, r: 4, fill: 'white' }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
