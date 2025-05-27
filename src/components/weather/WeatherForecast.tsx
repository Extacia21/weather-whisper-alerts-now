
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning } from 'lucide-react';

interface WeatherForecastProps {
  data: any[];
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ data }) => {
  if (!data) return null;

  const getWeatherIcon = (iconType: string) => {
    const iconClass = "w-10 h-10 text-white";
    switch (iconType) {
      case 'sun':
        return <Sun className={iconClass} />;
      case 'cloud-sun':
        return <CloudSun className={iconClass} />;
      case 'cloud':
        return <Cloud className={iconClass} />;
      case 'cloud-rain':
        return <CloudRain className={iconClass} />;
      case 'cloud-lightning':
        return <CloudLightning className={iconClass} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  return (
    <Card className="bg-white/20 backdrop-blur-md border-white/30">
      <CardHeader>
        <CardTitle className="text-white text-xl">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((day, index) => (
            <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="flex justify-center">
                  {getWeatherIcon(day.icon)}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{day.day}</p>
                  <p className="text-white/80">{day.condition}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold text-lg">{day.high}°</p>
                <p className="text-white/80">{day.low}°</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
