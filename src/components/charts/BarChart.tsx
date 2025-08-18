
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartProps {
  data: any[];
  dataKey: string;
  xAxisDataKey?: string;
  fill?: string;
  title?: string;
}

export const BarChart = ({ 
  data, 
  dataKey, 
  xAxisDataKey = "name", 
  fill = "#4f46e5",
  title
}: BarChartProps) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
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
            <Bar 
              dataKey={dataKey} 
              fill={fill} 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
