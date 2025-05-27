
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CloudSun, Sun, Cloud, CloudRain } from 'lucide-react';

interface CurrentWeatherProps {
  data: any;
  location: { city: string; country: string };
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, location }) => {
  if (!data) return null;

  const getWeatherIcon = (condition: string) => {
    const iconClass = "w-24 h-24 text-white";
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className={iconClass} />;
      case 'partly cloudy':
        return <CloudSun className={iconClass} />;
      case 'cloudy':
        return <Cloud className={iconClass} />;
      case 'rainy':
        return <CloudRain className={iconClass} />;
      default:
        return <Sun className={iconClass} />;
    }
  };

  return (
    <Card className="bg-white/20 backdrop-blur-md border-white/30 text-white h-full">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{location.city}, {location.country}</h2>
            <p className="text-white/80 text-lg">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          <div className="text-right">
            <p className="text-6xl font-light mb-2">{data.temperature}°</p>
            <p className="text-xl text-white/90">Feels like {data.feelsLike}°</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getWeatherIcon(data.condition)}
            <div className="ml-4">
              <p className="text-2xl font-medium">{data.condition}</p>
              <p className="text-white/80">Current conditions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
