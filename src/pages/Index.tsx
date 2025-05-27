
import React, { useState, useEffect } from 'react';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { WeatherForecast } from '@/components/weather/WeatherForecast';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { WeatherAlerts } from '@/components/weather/WeatherAlerts';
import { WeatherMetrics } from '@/components/weather/WeatherMetrics';
import { ZimbabweLocationSearch } from '@/components/weather/ZimbabweLocationSearch';
import { ZimbabweWeatherMap } from '@/components/weather/ZimbabweWeatherMap';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [location, setLocation] = useState({ city: 'Harare', country: 'Zimbabwe' });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Zimbabwe-specific weather data - in a real app, this would come from a weather API
  const mockWeatherData = {
    current: {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 45,
      windSpeed: 15,
      pressure: 1018,
      visibility: 12,
      uvIndex: 8,
      feelsLike: 31,
    },
    hourly: [
      { time: '12:00', temp: 28, condition: 'sunny', icon: 'sun' },
      { time: '13:00', temp: 30, condition: 'sunny', icon: 'sun' },
      { time: '14:00', temp: 32, condition: 'partly-cloudy', icon: 'cloud-sun' },
      { time: '15:00', temp: 31, condition: 'cloudy', icon: 'cloud' },
      { time: '16:00', temp: 29, condition: 'thunderstorm', icon: 'cloud-rain' },
      { time: '17:00', temp: 26, condition: 'rainy', icon: 'cloud-rain' },
    ],
    daily: [
      { day: 'Today', high: 32, low: 18, condition: 'Partly Cloudy', icon: 'cloud-sun' },
      { day: 'Tomorrow', high: 29, low: 16, condition: 'Thunderstorms', icon: 'cloud-rain' },
      { day: 'Wednesday', high: 35, low: 22, condition: 'Sunny', icon: 'sun' },
      { day: 'Thursday', high: 33, low: 20, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Friday', high: 27, low: 15, condition: 'Rainy', icon: 'cloud-lightning' },
    ],
    alerts: [
      {
        type: 'warning',
        title: 'Thunderstorm Alert',
        message: 'Severe thunderstorms expected in Harare and surrounding areas between 3-6 PM today',
        severity: 'moderate'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call for Zimbabwe weather data
    const fetchWeatherData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWeatherData(mockWeatherData);
      setLoading(false);
      
      // Show weather notification
      toast({
        title: "Zimbabwe Weather Updated",
        description: `Current conditions for ${location.city}: ${mockWeatherData.current.condition}, ${mockWeatherData.current.temperature}°C`,
      });
    };

    fetchWeatherData();
  }, [location, toast]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-yellow-500 to-red-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Zimbabwe weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-yellow-500 to-red-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">Zimbabwe Weather Dashboard</h1>
          <p className="text-white/80 text-center mb-4">Comprehensive weather information for all Zimbabwe locations</p>
          <ZimbabweLocationSearch onLocationChange={handleLocationChange} currentLocation={location} />
        </div>

        {/* Weather Alerts */}
        {weatherData?.alerts && weatherData.alerts.length > 0 && (
          <div className="mb-6">
            <WeatherAlerts alerts={weatherData.alerts} />
          </div>
        )}

        {/* Weather Map */}
        <div className="mb-8">
          <ZimbabweWeatherMap selectedLocation={location} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Weather - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <CurrentWeather 
              data={weatherData?.current} 
              location={location}
            />
          </div>

          {/* Weather Metrics */}
          <div>
            <WeatherMetrics data={weatherData?.current} />
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="mb-8">
          <HourlyForecast data={weatherData?.hourly} />
        </div>

        {/* Daily Forecast */}
        <div className="mb-8">
          <WeatherForecast data={weatherData?.daily} />
        </div>
      </div>
    </div>
  );
};

export default Index;
