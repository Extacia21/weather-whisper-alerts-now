
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning, MapPin } from 'lucide-react';

interface WeatherLocation {
  city: string;
  lat: number;
  lng: number;
  temperature: number;
  condition: string;
  icon: string;
}

interface ZimbabweWeatherMapProps {
  selectedLocation: { city: string; country: string };
}

export const ZimbabweWeatherMap: React.FC<ZimbabweWeatherMapProps> = ({ selectedLocation }) => {
  // Mock weather data for major Zimbabwe cities
  const weatherLocations: WeatherLocation[] = [
    { city: 'Harare', lat: -17.8292, lng: 31.0522, temperature: 28, condition: 'Partly Cloudy', icon: 'cloud-sun' },
    { city: 'Bulawayo', lat: -20.1698, lng: 28.5753, temperature: 31, condition: 'Sunny', icon: 'sun' },
    { city: 'Mutare', lat: -18.9707, lng: 32.6731, temperature: 25, condition: 'Cloudy', icon: 'cloud' },
    { city: 'Gweru', lat: -19.4500, lng: 29.8167, temperature: 30, condition: 'Sunny', icon: 'sun' },
    { city: 'Kwekwe', lat: -18.9333, lng: 29.8167, temperature: 29, condition: 'Thunderstorms', icon: 'cloud-lightning' },
    { city: 'Kadoma', lat: -18.3333, lng: 29.9167, temperature: 32, condition: 'Sunny', icon: 'sun' },
    { city: 'Masvingo', lat: -20.0736, lng: 30.8308, temperature: 27, condition: 'Rainy', icon: 'cloud-rain' },
    { city: 'Chinhoyi', lat: -17.3667, lng: 30.2000, temperature: 26, condition: 'Partly Cloudy', icon: 'cloud-sun' },
    { city: 'Victoria Falls', lat: -17.9243, lng: 25.8572, temperature: 35, condition: 'Sunny', icon: 'sun' },
    { city: 'Hwange', lat: -18.3667, lng: 26.5000, temperature: 33, condition: 'Sunny', icon: 'sun' },
    { city: 'Kariba', lat: -16.5167, lng: 28.8000, temperature: 38, condition: 'Hot', icon: 'sun' },
    { city: 'Beitbridge', lat: -22.2167, lng: 30.0000, temperature: 36, condition: 'Very Hot', icon: 'sun' },
  ];

  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  const getWeatherIcon = (iconType: string) => {
    const iconClass = "w-6 h-6 text-white";
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

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return 'bg-red-500';
    if (temp >= 30) return 'bg-orange-500';
    if (temp >= 25) return 'bg-yellow-500';
    if (temp >= 20) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="bg-white/20 backdrop-blur-md border-white/30">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center">
          <MapPin className="w-6 h-6 mr-2" />
          Zimbabwe Weather Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-green-900/30 rounded-lg p-8 min-h-[400px] overflow-hidden">
          {/* Simplified Zimbabwe map outline */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Simplified Zimbabwe border */}
              <path
                d="M50 80 L350 80 L350 220 L50 220 Z"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.5"
              />
            </svg>
          </div>

          {/* Weather location markers */}
          <div className="relative w-full h-full">
            {weatherLocations.map((location, index) => {
              // Calculate position as percentage of map area
              const x = ((location.lng + 35) / 10) * 100; // Normalize longitude
              const y = ((location.lat + 25) / 10) * 100; // Normalize latitude
              
              return (
                <div
                  key={location.city}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${Math.max(10, Math.min(90, x))}%`,
                    top: `${Math.max(10, Math.min(90, 100 - y))}%`,
                  }}
                  onMouseEnter={() => setHoveredLocation(location.city)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  <div className={`
                    ${getTemperatureColor(location.temperature)} 
                    rounded-full p-2 shadow-lg border-2 border-white
                    ${selectedLocation.city === location.city ? 'ring-4 ring-white/50' : ''}
                    ${hoveredLocation === location.city ? 'scale-110' : ''}
                    transition-all duration-200
                  `}>
                    {getWeatherIcon(location.icon)}
                  </div>
                  
                  {/* Tooltip */}
                  {hoveredLocation === location.city && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                      <div className="font-semibold">{location.city}</div>
                      <div>{location.temperature}°C - {location.condition}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/60 rounded-lg p-3">
            <h4 className="text-white font-semibold mb-2 text-sm">Temperature Scale</h4>
            <div className="space-y-1 text-xs text-white/90">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>&lt;20°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>20-25°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>25-30°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span>30-35°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>&gt;35°C</span>
              </div>
            </div>
          </div>

          {/* Current selection indicator */}
          <div className="absolute top-4 right-4 bg-black/60 rounded-lg p-3">
            <div className="text-white text-sm">
              <div className="font-semibold">Selected Location</div>
              <div className="text-white/90">{selectedLocation.city}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
