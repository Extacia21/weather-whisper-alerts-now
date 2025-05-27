
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Bell, Moon, Sun, MapPin, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalizedSettingsProps {
  onSettingsChange: (settings: any) => void;
}

export const PersonalizedSettings: React.FC<PersonalizedSettingsProps> = ({ 
  onSettingsChange 
}) => {
  const [settings, setSettings] = useState({
    darkMode: false,
    severAlert: true,
    dailySummary: true,
    hourlyUpdates: false,
    location: 'Harare',
    temperatureUnit: 'C',
    windUnit: 'kmh',
    notifications: {
      rain: true,
      thunderstorms: true,
      temperature: true,
      wind: false
    },
    theme: 'futuristic'
  });

  const { toast } = useToast();

  const handleToggle = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
    
    toast({
      title: "Settings Updated",
      description: `${key} has been ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handleNotificationToggle = (type: string, value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: { ...settings.notifications, [type]: value }
    };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const saveSettings = () => {
    localStorage.setItem('weatherSettings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your preferences have been saved successfully",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/40 via-blue-900/30 to-purple-900/40 backdrop-blur-xl border-white/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white text-xl flex items-center">
          <Settings className="w-6 h-6 mr-3 text-cyan-400" />
          Personalized Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Display Preferences */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg flex items-center">
            <Palette className="w-5 h-5 mr-2 text-purple-400" />
            Display Settings
          </h3>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {settings.darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                <span className="text-white">Dark Mode</span>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(value) => handleToggle('darkMode', value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/80 text-sm">Temperature Unit</label>
                <select 
                  className="w-full mt-1 bg-white/20 border border-white/30 rounded text-white text-sm p-2"
                  value={settings.temperatureUnit}
                  onChange={(e) => setSettings({...settings, temperatureUnit: e.target.value})}
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                </select>
              </div>
              <div>
                <label className="text-white/80 text-sm">Wind Unit</label>
                <select 
                  className="w-full mt-1 bg-white/20 border border-white/30 rounded text-white text-sm p-2"
                  value={settings.windUnit}
                  onChange={(e) => setSettings({...settings, windUnit: e.target.value})}
                >
                  <option value="kmh">km/h</option>
                  <option value="mph">mph</option>
                  <option value="ms">m/s</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg flex items-center">
            <Bell className="w-5 h-5 mr-2 text-green-400" />
            Smart Notifications
          </h3>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white">Severe Weather Alerts</span>
              <Switch
                checked={settings.severAlert}
                onCheckedChange={(value) => handleToggle('severAlert', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Daily Weather Summary</span>
              <Switch
                checked={settings.dailySummary}
                onCheckedChange={(value) => handleToggle('dailySummary', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Hourly Updates</span>
              <Switch
                checked={settings.hourlyUpdates}
                onCheckedChange={(value) => handleToggle('hourlyUpdates', value)}
              />
            </div>

            <div className="border-t border-white/20 pt-3 mt-3">
              <p className="text-white/80 text-sm mb-2">Weather Type Alerts:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(settings.notifications).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-white/70 text-sm capitalize">{type}</span>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(value) => handleNotificationToggle(type, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location Settings */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-400" />
            Location Preferences
          </h3>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <Input
              placeholder="Default location"
              value={settings.location}
              onChange={(e) => setSettings({...settings, location: e.target.value})}
              className="bg-white/20 border-white/30 text-white placeholder-white/70"
            />
          </div>
        </div>

        {/* Save Button */}
        <Button 
          onClick={saveSettings}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};
