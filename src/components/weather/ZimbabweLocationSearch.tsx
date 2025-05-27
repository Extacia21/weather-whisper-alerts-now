
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const zimbabweLocations = [
  'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 'Kwekwe', 'Kadoma',
  'Masvingo', 'Chinhoyi', 'Marondera', 'Bindura', 'Beitbridge', 'Redcliff',
  'Victoria Falls', 'Hwange', 'Chegutu', 'Shurugwi', 'Kariba', 'Karoi',
  'Chipinge', 'Gokwe', 'Zvishavane', 'Mhangura', 'Rusape', 'Chiredzi',
  'Mazowe', 'Norton', 'Ruwa', 'Plumtree', 'Gwanda'
];

interface ZimbabweLocationSearchProps {
  onLocationChange: (location: { city: string; country: string }) => void;
  currentLocation: { city: string; country: string };
}

export const ZimbabweLocationSearch: React.FC<ZimbabweLocationSearchProps> = ({ 
  onLocationChange, 
  currentLocation 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSearch = (cityName?: string) => {
    const selectedCity = cityName || searchTerm;
    if (selectedCity.trim()) {
      const matchedCity = zimbabweLocations.find(
        city => city.toLowerCase() === selectedCity.toLowerCase()
      );
      
      if (matchedCity) {
        onLocationChange({ 
          city: matchedCity, 
          country: 'Zimbabwe' 
        });
        setSearchTerm('');
        setSuggestions([]);
        toast({
          title: "Location Updated",
          description: `Weather data updated for ${matchedCity}, Zimbabwe`,
        });
      } else {
        toast({
          title: "Location Not Found",
          description: `${selectedCity} is not a recognized Zimbabwe location`,
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      const filtered = zimbabweLocations.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates to find the nearest Zimbabwe city
          onLocationChange({ city: 'Current Location (Zimbabwe)', country: 'Zimbabwe' });
          toast({
            title: "Location Detected",
            description: "Using your current location in Zimbabwe",
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
        <div className="relative">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex-1 flex items-center space-x-2">
              <Input
                placeholder="Search Zimbabwe cities (e.g., Harare, Bulawayo)"
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
              <Button 
                onClick={() => handleSearch()}
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
          
          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white/20 backdrop-blur-md border-white/30 rounded-lg mt-1 z-10">
              {suggestions.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(city)}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/20 first:rounded-t-lg last:rounded-b-lg"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <p className="text-white/80 text-sm text-center">
          Currently showing weather for {currentLocation.city}, {currentLocation.country}
        </p>
      </CardContent>
    </Card>
  );
};
