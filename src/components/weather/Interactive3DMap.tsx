
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Layers, RotateCw, ZoomIn, ZoomOut, Navigation } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    type: string;
  }>>([]);

  // Enhanced weather locations with your specific coordinates
  const enhancedLocations: WeatherLocation[] = [
    { city: 'Harare', lat: -17.8292, lng: 31.0522, temperature: 28, condition: 'Thunderstorms', humidity: 45, windSpeed: 15, precipitation: 25 },
    { city: 'Bulawayo', lat: -20.1698, lng: 28.5753, temperature: 31, condition: 'Sunny', humidity: 30, windSpeed: 8, precipitation: 0 },
    { city: 'Mutare', lat: -18.9707, lng: 32.6731, temperature: 25, condition: 'Rainy', humidity: 85, windSpeed: 12, precipitation: 15 },
    { city: 'Gweru', lat: -19.4500, lng: 29.8167, temperature: 30, condition: 'Sunny', humidity: 35, windSpeed: 10, precipitation: 0 },
    { city: 'Custom Location', lat: -19.01692, lng: 29.1528, temperature: 32, condition: 'Partly Cloudy', humidity: 40, windSpeed: 18, precipitation: 5 },
    { city: 'Victoria Falls', lat: -17.9243, lng: 25.8572, temperature: 35, condition: 'Hot', humidity: 25, windSpeed: 5, precipitation: 0 },
    { city: 'Masvingo', lat: -20.0736, lng: 30.8308, temperature: 27, condition: 'Thunderstorms', humidity: 90, windSpeed: 25, precipitation: 35 },
  ];

  const createWeatherParticles = (condition: string, intensity: number, x: number, y: number) => {
    const newParticles: typeof particlesRef.current = [];
    const count = Math.floor(intensity / 5);
    
    for (let i = 0; i < count; i++) {
      if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('thunderstorm')) {
        newParticles.push({
          x: x + (Math.random() - 0.5) * 80,
          y: y + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 8 + 4,
          life: 1,
          type: 'rain'
        });
      } else if (condition.toLowerCase().includes('cloud')) {
        newParticles.push({
          x: x + (Math.random() - 0.5) * 120,
          y: y + (Math.random() - 0.5) * 120,
          vx: (Math.random() - 0.5) * 1,
          vy: Math.random() * 2,
          life: 1,
          type: 'cloud'
        });
      }
    }
    
    return newParticles;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Enhanced gradient background with 3D effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.3, '#1e293b');
      gradient.addColorStop(0.6, '#334155');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw 3D-style Zimbabwe outline
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      
      if (viewMode === '3D') {
        ctx.rotate((rotation.y * Math.PI) / 180);
        // Add 3D perspective effect
        ctx.transform(1, 0, Math.sin(rotation.x * Math.PI / 180) * 0.3, 0.8, 0, 0);
      }

      // Enhanced country border with glow effect
      ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.9)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      
      // Draw Zimbabwe border with more accurate proportions
      const borderPath = new Path2D();
      borderPath.rect(-180, -120, 360, 240);
      ctx.stroke(borderPath);

      // Add terrain-like grid lines
      ctx.shadowBlur = 5;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 6]);
      
      for (let i = -160; i <= 160; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, -120);
        ctx.lineTo(i, 120);
        ctx.stroke();
      }
      
      for (let i = -100; i <= 100; i += 40) {
        ctx.beginPath();
        ctx.moveTo(-180, i);
        ctx.lineTo(180, i);
        ctx.stroke();
      }

      ctx.restore();

      // Update and draw weather particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        return particle.life > 0 && particle.y < canvas.height + 50;
      });

      // Draw enhanced weather locations with particles
      enhancedLocations.forEach((location, index) => {
        // Convert lat/lng to canvas coordinates with proper scaling
        const x = ((location.lng - 25.8) / (33.1 - 25.8)) * canvas.width;
        const y = ((location.lat + 22.4) / (-15.6 + 22.4)) * canvas.height;

        // Add weather particles
        const newParticles = createWeatherParticles(location.condition, location.precipitation, x, y);
        particlesRef.current.push(...newParticles);

        // Draw particles with enhanced effects
        particlesRef.current.forEach(particle => {
          if (Math.abs(particle.x - x) < 100 && Math.abs(particle.y - y) < 100) {
            ctx.save();
            ctx.globalAlpha = particle.life;
            
            if (particle.type === 'rain') {
              ctx.strokeStyle = '#3b82f6';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3);
              ctx.stroke();
            } else if (particle.type === 'cloud') {
              ctx.fillStyle = '#e5e7eb';
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, Math.random() * 4 + 2, 0, 2 * Math.PI);
              ctx.fill();
            }
            
            ctx.restore();
          }
        });

        // Enhanced temperature markers with professional styling
        const tempColor = location.temperature > 35 ? '#ef4444' : 
                         location.temperature > 30 ? '#f97316' : 
                         location.temperature > 25 ? '#eab308' :
                         location.temperature > 20 ? '#22c55e' : '#3b82f6';
        
        // Outer glow
        ctx.shadowColor = tempColor;
        ctx.shadowBlur = 25;
        ctx.fillStyle = tempColor;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, 2 * Math.PI);
        ctx.fill();

        // Inner core
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Location labels with better typography
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeText(`${location.temperature}°C`, x, y - 20);
        ctx.fillText(`${location.temperature}°C`, x, y - 20);
        
        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.strokeText(location.city, x, y + 35);
        ctx.fillText(location.city, x, y + 35);

        // Special highlighting for custom coordinates
        if (location.city === 'Custom Location') {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 3;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(x, y, 20, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      if (isRotating && viewMode === '3D') {
        setRotation(prev => ({ 
          ...prev, 
          y: prev.y + 0.3,
          x: prev.x + Math.sin(Date.now() * 0.001) * 0.1
        }));
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [zoom, rotation, isRotating, viewMode]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.3, 4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.3, 0.5));
  const toggleRotation = () => setIsRotating(prev => !prev);
  const toggleViewMode = () => setViewMode(prev => prev === '2D' ? '3D' : '2D');

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900/30 via-blue-900/20 to-purple-900/30 backdrop-blur-2xl border border-white/20 shadow-2xl">
      <CardHeader className="pb-3">
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
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleViewMode}
              className={`text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ${viewMode === '3D' ? 'bg-white/20' : ''}`}
            >
              <Navigation className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleRotation}
              className={`text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 ${isRotating ? 'bg-white/20' : ''}`}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleZoomIn}
              className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
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
          
          {/* Enhanced coordinate display */}
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-cyan-400/30 shadow-2xl">
            <div className="text-white text-sm space-y-1">
              <div className="font-bold text-cyan-300 mb-2">Custom Coordinates</div>
              <div className="text-amber-300 font-mono text-xs">
                Lat: -19.01692°
              </div>
              <div className="text-amber-300 font-mono text-xs">
                Lng: 29.1528°
              </div>
              <div className="text-gray-300 text-xs mt-2">
                Geohash: kssez6h6ms
              </div>
              <div className="text-purple-300 text-xs">
                {viewMode} View Mode
              </div>
            </div>
          </div>

          {/* Enhanced legend with professional styling */}
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-2xl">
            <h4 className="text-white font-bold mb-3 text-sm flex items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full mr-2 animate-pulse"></div>
              Live Weather Data
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                <span className="text-blue-200">Rain & Storms</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-300 rounded-full shadow-lg shadow-gray-300/50"></div>
                <span className="text-gray-200">Cloud Cover</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-red-500 rounded-full shadow-lg"></div>
                <span className="text-white">Temperature Zones</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse"></div>
                <span className="text-yellow-200">Custom Location</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
