
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Layers, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeatherLocation {
  city: string;
  lat: number;
  lng: number;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

interface Interactive3DMapProps {
  selectedLocation: { city: string; country: string };
  weatherData: WeatherLocation[];
}

export const Interactive3DMap: React.FC<Interactive3DMapProps> = ({ 
  selectedLocation, 
  weatherData 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Enhanced weather locations with more data
  const enhancedLocations: WeatherLocation[] = [
    { city: 'Harare', lat: -17.8292, lng: 31.0522, temperature: 28, condition: 'Partly Cloudy', humidity: 45, windSpeed: 15, precipitation: 0 },
    { city: 'Bulawayo', lat: -20.1698, lng: 28.5753, temperature: 31, condition: 'Sunny', humidity: 30, windSpeed: 8, precipitation: 0 },
    { city: 'Mutare', lat: -18.9707, lng: 32.6731, temperature: 25, condition: 'Rainy', humidity: 85, windSpeed: 12, precipitation: 15 },
    { city: 'Gweru', lat: -19.4500, lng: 29.8167, temperature: 30, condition: 'Sunny', humidity: 35, windSpeed: 10, precipitation: 0 },
    { city: 'Victoria Falls', lat: -17.9243, lng: 25.8572, temperature: 35, condition: 'Hot', humidity: 25, windSpeed: 5, precipitation: 0 },
    { city: 'Masvingo', lat: -20.0736, lng: 30.8308, temperature: 27, condition: 'Thunderstorms', humidity: 90, windSpeed: 25, precipitation: 35 },
  ];

  const getWeatherParticles = (condition: string, intensity: number) => {
    switch (condition.toLowerCase()) {
      case 'rainy':
        return { type: 'rain', count: Math.floor(intensity * 2), color: '#4FC3F7' };
      case 'thunderstorms':
        return { type: 'storm', count: Math.floor(intensity * 3), color: '#9C27B0' };
      case 'sunny':
        return { type: 'sun', count: 0, color: '#FFD54F' };
      default:
        return { type: 'none', count: 0, color: '#E0E0E0' };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create 3D-like gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#1e3c72');
      gradient.addColorStop(0.5, '#2a5298');
      gradient.addColorStop(1, '#1e3c72');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Zimbabwe outline with 3D effect
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      ctx.rotate((rotation.y * Math.PI) / 180);

      // Shadow effect
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      // Draw country border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(-150, -100, 300, 200);

      ctx.restore();

      // Draw weather locations with particles
      enhancedLocations.forEach((location, index) => {
        const x = ((location.lng + 30) / 8) * canvas.width;
        const y = ((location.lat + 22) / -6) * canvas.height;

        const particles = getWeatherParticles(location.condition, location.precipitation);
        
        // Draw weather particles
        if (particles.count > 0) {
          for (let i = 0; i < particles.count; i++) {
            const particleX = x + (Math.random() - 0.5) * 60;
            const particleY = y + (Math.random() - 0.5) * 60 + (Date.now() / 1000 * 50) % 60;
            
            ctx.fillStyle = particles.color;
            if (particles.type === 'rain') {
              ctx.fillRect(particleX, particleY, 1, 8);
            } else if (particles.type === 'storm') {
              ctx.beginPath();
              ctx.arc(particleX, particleY, 2, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        }

        // Draw temperature markers with glow effect
        const tempColor = location.temperature > 30 ? '#FF5722' : 
                         location.temperature > 20 ? '#FF9800' : '#2196F3';
        
        ctx.shadowColor = tempColor;
        ctx.shadowBlur = 15;
        ctx.fillStyle = tempColor;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Temperature text
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${location.temperature}°`, x, y - 15);
        ctx.fillText(location.city, x, y + 25);
      });

      if (isRotating) {
        setRotation(prev => ({ ...prev, y: prev.y + 0.5 }));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [zoom, rotation, isRotating]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const toggleRotation = () => setIsRotating(prev => !prev);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-xl border-white/10 shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-xl flex items-center justify-between">
          <div className="flex items-center">
            <Layers className="w-6 h-6 mr-3 text-cyan-400" />
            Interactive 3D Weather Map
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleZoomOut}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleRotation}
              className={`text-white/70 hover:text-white hover:bg-white/10 ${isRotating ? 'bg-white/20' : ''}`}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleZoomIn}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-96">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Glassmorphism overlay for current location */}
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <div className="text-white text-sm">
              <div className="font-bold text-cyan-300 mb-1">Active Location</div>
              <div className="text-orange-300 font-semibold">{selectedLocation.city}</div>
              <div className="text-gray-300 text-xs mt-1">Real-time Data</div>
            </div>
          </div>

          {/* Weather legend with glassmorphism */}
          <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-lg rounded-xl p-4 border border-white/20">
            <h4 className="text-white font-bold mb-3 text-sm">Weather Indicators</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full shadow-blue-400/50 shadow-lg"></div>
                <span className="text-blue-200">Rain Particles</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full shadow-purple-400/50 shadow-lg"></div>
                <span className="text-purple-200">Storm Activity</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-400 rounded-full shadow-orange-400/50 shadow-lg"></div>
                <span className="text-orange-200">Temperature Zones</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
