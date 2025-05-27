
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, Wind, Gauge, Eye } from 'lucide-react';

interface WeatherMetricsProps {
  data: any;
}

export const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ data }) => {
  if (!data) return null;

  const metrics = [
    {
      title: 'Humidity',
      value: `${data.humidity}%`,
      icon: <Droplets className="w-5 h-5" />,
      color: 'text-blue-500'
    },
    {
      title: 'Wind Speed',
      value: `${data.windSpeed} km/h`,
      icon: <Wind className="w-5 h-5" />,
      color: 'text-green-500'
    },
    {
      title: 'Pressure',
      value: `${data.pressure} hPa`,
      icon: <Gauge className="w-5 h-5" />,
      color: 'text-purple-500'
    },
    {
      title: 'Visibility',
      value: `${data.visibility} km`,
      icon: <Eye className="w-5 h-5" />,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="space-y-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white/20 backdrop-blur-md border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`${metric.color} bg-white/20 p-2 rounded-lg`}>
                  {metric.icon}
                </div>
                <div>
                  <p className="text-white/80 text-sm">{metric.title}</p>
                  <p className="text-white font-semibold text-lg">{metric.value}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
