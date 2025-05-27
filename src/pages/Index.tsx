
import React, { useState, useEffect } from 'react';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { WeatherForecast } from '@/components/weather/WeatherForecast';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { WeatherAlerts } from '@/components/weather/WeatherAlerts';
import { WeatherMetrics } from '@/components/weather/WeatherMetrics';
import { LocationSearch } from '@/components/weather/LocationSearch';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [location, setLocation] = useState({ city: 'London', country: 'UK' });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Simulated weather data - in a real app, this would come from a weather API
  const mockWeatherData = {
    current: {
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6,
      feelsLike: 24,
    },
    hourly: [
      { time: '12:00', temp: 22, condition: 'sunny', icon: 'sun' },
      { time: '13:00', temp: 24, condition: 'sunny', icon: 'sun' },
      { time: '14:00', temp: 26, condition: 'partly-cloudy', icon: 'cloud-sun' },
      { time: '15:00', temp: 25, condition: 'cloudy', icon: 'cloud' },
      { time: '16:00', temp: 23, condition: 'rainy', icon: 'cloud-rain' },
      { time: '17:00', temp: 21, condition: 'rainy', icon: 'cloud-rain' },
    ],
    daily: [
      { day: 'Today', high: 26, low: 18, condition: 'Partly Cloudy', icon: 'cloud-sun' },
      { day: 'Tomorrow', high: 24, low: 16, condition: 'Rainy', icon: 'cloud-rain' },
      { day: 'Wednesday', high: 28, low: 20, condition: 'Sunny', icon: 'sun' },
      { day: 'Thursday', high: 25, low: 17, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Friday', high: 23, low: 15, condition: 'Stormy', icon: 'cloud-lightning' },
    ],
    alerts: [
      {
        type: 'warning',
        title: 'Rain Alert',
        message: 'Heavy rain expected between 3-6 PM today',
        severity: 'moderate'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchWeatherData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWeatherData(mockWeatherData);
      setLoading(false);
      
      // Show weather notification
      toast({
        title: "Weather Updated",
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
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">Weather Dashboard</h1>
          <LocationSearch onLocationChange={handleLocationChange} currentLocation={location} />
        </div>

        {/* Weather Alerts */}
        {weatherData?.alerts && weatherData.alerts.length > 0 && (
          <div className="mb-6">
            <WeatherAlerts alerts={weatherData.alerts} />
          </div>
        )}

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
