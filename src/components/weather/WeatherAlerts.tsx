
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, CloudRain, CloudSnow, Wind } from 'lucide-react';

interface WeatherAlert {
  type: string;
  title: string;
  message: string;
  severity: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  const getAlertIcon = (type: string) => {
    const iconClass = "w-6 h-6";
    switch (type) {
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'rain':
        return <CloudRain className={iconClass} />;
      case 'snow':
        return <CloudSnow className={iconClass} />;
      case 'wind':
        return <Wind className={iconClass} />;
      default:
        return <AlertTriangle className={iconClass} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe':
        return 'bg-red-500/20 border-red-500/50 text-red-100';
      case 'moderate':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-100';
      case 'minor':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-100';
      default:
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-100';
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => (
        <Card key={index} className={`${getSeverityColor(alert.severity)} backdrop-blur-md border animate-pulse`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1">
                {getAlertIcon(alert.type)}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                <p className="opacity-90">{alert.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
