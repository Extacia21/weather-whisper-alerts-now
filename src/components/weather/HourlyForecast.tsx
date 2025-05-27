
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudSun, CloudRain } from 'lucide-react';

interface HourlyForecastProps {
  data: any[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  if (!data) return null;

  const getWeatherIcon = (iconType: string) => {
    const iconClass = "w-8 h-8 text-white";
    switch (iconType) {
      case 'sun':
        return <Sun className={iconClass} />;
      case 'cloud-sun':
        return <CloudSun className={iconClass} />;
      case 'cloud':
        return <Cloud className={iconClass} />;
      case 'cloud-rain':
        return <CloudRain className={iconClass} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  return (
    <Card className="bg-white/20 backdrop-blur-md border-white/30">
      <CardHeader>
        <CardTitle className="text-white text-xl">Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {data.map((hour, index) => (
            <div key={index} className="flex-shrink-0 text-center bg-white/10 rounded-lg p-4 min-w-[100px]">
              <p className="text-white/80 text-sm mb-2">{hour.time}</p>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(hour.icon)}
              </div>
              <p className="text-white font-semibold text-lg">{hour.temp}°</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
