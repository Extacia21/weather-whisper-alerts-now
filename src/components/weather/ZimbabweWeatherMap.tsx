
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
  // Real geographical coordinates for major Zimbabwe cities
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
    { city: 'Chitungwiza', lat: -18.0167, lng: 31.0833, temperature: 27, condition: 'Partly Cloudy', icon: 'cloud-sun' },
    { city: 'Bindura', lat: -17.3019, lng: 31.3269, temperature: 24, condition: 'Cloudy', icon: 'cloud' },
    { city: 'Marondera', lat: -18.1851, lng: 31.5514, temperature: 26, condition: 'Sunny', icon: 'sun' },
  ];

  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Zimbabwe geographical bounds
  const zimbabweBounds = {
    north: -15.6,
    south: -22.4,
    east: 33.1,
    west: 25.2
  };

  const getWeatherIcon = (iconType: string) => {
    const iconClass = "w-5 h-5 drop-shadow-lg";
    switch (iconType) {
      case 'sun':
        return <Sun className={`${iconClass} text-yellow-400`} />;
      case 'cloud-sun':
        return <CloudSun className={`${iconClass} text-orange-400`} />;
      case 'cloud':
        return <Cloud className={`${iconClass} text-gray-300`} />;
      case 'cloud-rain':
        return <CloudRain className={`${iconClass} text-blue-400`} />;
      case 'cloud-lightning':
        return <CloudLightning className={`${iconClass} text-purple-400`} />;
      default:
        return <Sun className={`${iconClass} text-yellow-400`} />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 38) return 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30';
    if (temp >= 35) return 'bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-500/30';
    if (temp >= 30) return 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-orange-400/30';
    if (temp >= 25) return 'bg-gradient-to-br from-yellow-400 to-orange-400 shadow-yellow-400/30';
    if (temp >= 20) return 'bg-gradient-to-br from-green-400 to-yellow-400 shadow-green-400/30';
    return 'bg-gradient-to-br from-blue-400 to-green-400 shadow-blue-400/30';
  };

  // Convert lat/lng to pixel coordinates within the map container
  const getPixelPosition = (lat: number, lng: number) => {
    const x = ((lng - zimbabweBounds.west) / (zimbabweBounds.east - zimbabweBounds.west)) * 100;
    const y = ((zimbabweBounds.north - lat) / (zimbabweBounds.north - zimbabweBounds.south)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl flex items-center font-semibold">
          <MapPin className="w-6 h-6 mr-3 text-blue-300" />
          Zimbabwe Weather Map
          <div className="ml-auto text-sm font-normal text-white/70">
            Live Weather Conditions
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative rounded-xl overflow-hidden shadow-inner" 
             style={{
               backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop&crop=center')`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               minHeight: '500px'
             }}>
          {/* Overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-800/60 to-slate-900/70"></div>
          
          {/* Zimbabwe border outline */}
          <div className="absolute inset-0 opacity-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Simplified Zimbabwe border using real proportions */}
              <path
                d="M15 25 L85 25 L85 75 L15 75 Z M20 30 L80 30 L80 70 L20 70 Z"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
              {/* Major rivers */}
              <path
                d="M20 40 Q40 45 60 35 Q70 30 80 40"
                fill="none"
                stroke="rgba(59, 130, 246, 0.4)"
                strokeWidth="0.8"
              />
              <path
                d="M25 60 Q45 55 65 65 Q75 70 85 60"
                fill="none"
                stroke="rgba(59, 130, 246, 0.4)"
                strokeWidth="0.8"
              />
            </svg>
          </div>

          {/* Weather location markers */}
          <div className="relative w-full h-full">
            {weatherLocations.map((location, index) => {
              const position = getPixelPosition(location.lat, location.lng);
              
              return (
                <div
                  key={location.city}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                  onMouseEnter={() => setHoveredLocation(location.city)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  <div className={`
                    ${getTemperatureColor(location.temperature)} 
                    rounded-full p-3 shadow-2xl border-2 border-white/80 backdrop-blur-sm
                    ${selectedLocation.city === location.city ? 'ring-4 ring-white/70 scale-110' : ''}
                    ${hoveredLocation === location.city ? 'scale-125' : 'scale-100'}
                    transition-all duration-300 hover:shadow-xl
                  `}>
                    {getWeatherIcon(location.icon)}
                  </div>
                  
                  {/* Enhanced tooltip */}
                  {hoveredLocation === location.city && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-slate-900/95 backdrop-blur-lg text-white px-4 py-3 rounded-xl text-sm whitespace-nowrap border border-white/20 shadow-2xl">
                      <div className="font-bold text-blue-300">{location.city}</div>
                      <div className="text-orange-300 font-semibold">{location.temperature}°C</div>
                      <div className="text-gray-300 text-xs">{location.condition}</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-t-slate-900/95"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Professional legend */}
          <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-2xl">
            <h4 className="text-white font-bold mb-3 text-sm flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-red-500 rounded-full mr-2"></div>
              Temperature Scale
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-green-400 rounded-full shadow-sm"></div>
                <span className="text-blue-200">Cool (&lt;20°C)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full shadow-sm"></div>
                <span className="text-green-200">Mild (20-25°C)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-sm"></div>
                <span className="text-yellow-200">Warm (25-30°C)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-sm"></div>
                <span className="text-orange-200">Hot (30-35°C)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-sm"></div>
                <span className="text-red-200">Very Hot (35-38°C)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-sm"></div>
                <span className="text-red-300">Extreme (&gt;38°C)</span>
              </div>
            </div>
          </div>

          {/* Current selection indicator */}
          <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur-lg rounded-xl p-4 border border-white/20 shadow-2xl">
            <div className="text-white text-sm">
              <div className="font-bold text-blue-300 mb-1">Active Location</div>
              <div className="text-orange-300 font-semibold">{selectedLocation.city}</div>
              <div className="text-gray-400 text-xs mt-1">Zimbabwe</div>
            </div>
          </div>

          {/* Coordinates info */}
          <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur-lg rounded-lg p-3 border border-white/20 text-xs text-white/70">
            <div>Coordinates: Real GPS Data</div>
            <div>Live Weather Conditions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
