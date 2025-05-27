
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationSearchProps {
  onLocationChange: (location: { city: string; country: string }) => void;
  currentLocation: { city: string; country: string };
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationChange, 
  currentLocation 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // In a real app, this would call a geocoding API
      const [city, country] = searchTerm.split(',').map(s => s.trim());
      onLocationChange({ 
        city: city || searchTerm, 
        country: country || 'Unknown' 
      });
      setSearchTerm('');
      toast({
        title: "Location Updated",
        description: `Weather data updated for ${city || searchTerm}`,
      });
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          onLocationChange({ city: 'Current Location', country: 'Auto-detected' });
          toast({
            title: "Location Detected",
            description: "Using your current location for weather data",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white/20 backdrop-blur-md border-white/30 max-w-2xl mx-auto">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1 flex items-center space-x-2">
            <Input
              placeholder="Search for a city (e.g., London, UK)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-white/20 border-white/30 text-white placeholder-white/70"
            />
            <Button 
              onClick={handleSearch}
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={handleGetCurrentLocation}
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Current
          </Button>
        </div>
        <p className="text-white/80 text-sm mt-2 text-center">
          Currently showing weather for {currentLocation.city}, {currentLocation.country}
        </p>
      </CardContent>
    </Card>
  );
};
