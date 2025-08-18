
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MultiLineChartProps {
  data: any[];
  xAxisDataKey?: string;
  lines: {
    dataKey: string;
    stroke: string;
    name: string;
  }[];
  title?: string;
}

export const MultiLineChart = ({ 
  data, 
  xAxisDataKey = "name", 
  lines,
  title
}: MultiLineChartProps) => {
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
              dataKey={xAxisDataKey} 
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
            {lines.map((line, index) => (
              <Line 
                key={index}
                type="monotone" 
                dataKey={line.dataKey} 
                stroke={line.stroke} 
                name={line.name}
                activeDot={{ r: 6 }} 
                strokeWidth={2}
                animationDuration={1500}
                dot={{ stroke: line.stroke, strokeWidth: 2, r: 4, fill: 'white' }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
