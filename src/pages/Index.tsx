
import React, { useState, useEffect } from 'react';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { WeatherForecast } from '@/components/weather/WeatherForecast';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { WeatherAlerts } from '@/components/weather/WeatherAlerts';
import { WeatherMetrics } from '@/components/weather/WeatherMetrics';
import { ZimbabweLocationSearch } from '@/components/weather/ZimbabweLocationSearch';
import { Interactive3DMap } from '@/components/weather/Interactive3DMap';
import { PersonalizedSettings } from '@/components/weather/PersonalizedSettings';
import { VoiceWeatherAssistant } from '@/components/weather/VoiceWeatherAssistant';
import { WeatherAnimations } from '@/components/weather/WeatherAnimations';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Settings, Sparkles } from 'lucide-react';

const Index = () => {
  const [location, setLocation] = useState({ city: 'Harare', country: 'Zimbabwe' });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [userSettings, setUserSettings] = useState({
    darkMode: false,
    animations: true,
    voiceEnabled: true
  });
  const { toast } = useToast();

  // Enhanced Zimbabwe-specific weather data
  const mockWeatherData = {
    current: {
      temperature: 28,
      condition: 'Thunderstorms',
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
      { day: 'Today', high: 32, low: 18, condition: 'Thunderstorms', icon: 'cloud-lightning' },
      { day: 'Tomorrow', high: 29, low: 16, condition: 'Partly Cloudy', icon: 'cloud-sun' },
      { day: 'Wednesday', high: 35, low: 22, condition: 'Sunny', icon: 'sun' },
      { day: 'Thursday', high: 33, low: 20, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Friday', high: 27, low: 15, condition: 'Rainy', icon: 'cloud-rain' },
    ],
    alerts: [
      {
        type: 'warning',
        title: 'Severe Thunderstorm Alert',
        message: 'Intense thunderstorms with heavy rainfall expected in Harare and surrounding areas between 3-6 PM today. Take necessary precautions.',
        severity: 'severe'
      }
    ]
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setWeatherData(mockWeatherData);
      setLoading(false);
      
      toast({
        title: "🌦️ Zimbabwe Weather Updated",
        description: `Real-time conditions for ${location.city}: ${mockWeatherData.current.condition}, ${mockWeatherData.current.temperature}°C`,
      });
    };

    fetchWeatherData();
  }, [location, toast]);

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  const handleSettingsChange = (newSettings) => {
    setUserSettings({ ...userSettings, ...newSettings });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="text-white text-center z-10">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-cyan-400 mx-auto mb-4 shadow-cyan-400/50 shadow-2xl"></div>
            <div className="absolute inset-0 rounded-full border-4 border-cyan-400/30 animate-ping"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Loading Zimbabwe Weather
          </h2>
          <p className="text-blue-200 animate-pulse">Fetching real-time atmospheric data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${
      userSettings.darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-black' 
        : 'bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600'
    } transition-all duration-1000`}>
      {/* Dynamic weather animations overlay */}
      {userSettings.animations && (
        <WeatherAnimations 
          condition={weatherData?.current?.condition || 'clear'} 
          intensity={1}
          className="fixed inset-0 z-0"
        />
      )}
      
      {/* Glassmorphism background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-8 text-center relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl font-bold text-white mb-1 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Zimbabwe Weather Intelligence
                  </h1>
                  <p className="text-blue-200">Advanced atmospheric monitoring & forecasting</p>
                </div>
              </div>
              
              <Button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </div>
            
            <ZimbabweLocationSearch onLocationChange={handleLocationChange} currentLocation={location} />
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-8 animate-fade-in">
              <PersonalizedSettings onSettingsChange={handleSettingsChange} />
            </div>
          )}

          {/* Weather Alerts */}
          {weatherData?.alerts && weatherData.alerts.length > 0 && (
            <div className="mb-6 animate-fade-in">
              <WeatherAlerts alerts={weatherData.alerts} />
            </div>
          )}

          {/* Interactive 3D Map */}
          <div className="mb-8 animate-fade-in">
            <Interactive3DMap selectedLocation={location} weatherData={[]} />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Current Weather - spans 2 columns */}
            <div className="lg:col-span-2 animate-fade-in">
              <CurrentWeather 
                data={weatherData?.current} 
                location={location}
              />
            </div>

            {/* Weather Metrics */}
            <div className="animate-fade-in delay-100">
              <WeatherMetrics data={weatherData?.current} />
            </div>

            {/* Voice Assistant */}
            {userSettings.voiceEnabled && (
              <div className="animate-fade-in delay-200">
                <VoiceWeatherAssistant 
                  currentWeather={weatherData?.current}
                  location={location}
                />
              </div>
            )}
          </div>

          {/* Forecasts */}
          <div className="space-y-8">
            <div className="animate-fade-in delay-300">
              <HourlyForecast data={weatherData?.hourly} />
            </div>

            <div className="animate-fade-in delay-400">
              <WeatherForecast data={weatherData?.daily} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
