import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceWeatherAssistantProps {
  currentWeather: any;
  location: { city: string; country: string };
}

export const VoiceWeatherAssistant: React.FC<VoiceWeatherAssistantProps> = ({ 
  currentWeather, 
  location 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        toast({
          title: "Voice Recognition Error",
          description: "Sorry, I couldn't understand that. Please try again.",
          variant: "destructive",
        });
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    let response = "";

    if (command.includes('weather') || command.includes('temperature')) {
      response = `The current weather in ${location.city} is ${currentWeather?.condition || 'unknown'} with a temperature of ${currentWeather?.temperature || 'unknown'}°C`;
    } else if (command.includes('humidity')) {
      response = `The humidity in ${location.city} is ${currentWeather?.humidity || 'unknown'}%`;
    } else if (command.includes('wind')) {
      response = `The wind speed in ${location.city} is ${currentWeather?.windSpeed || 'unknown'} kilometers per hour`;
    } else if (command.includes('forecast')) {
      response = `I can show you the weather forecast for ${location.city}. Check the forecast section below.`;
    } else {
      response = `I can help you with weather information for ${location.city}. Try asking about temperature, humidity, wind, or forecast.`;
    }

    speakResponse(response);
    
    toast({
      title: "Voice Command Processed",
      description: response,
    });
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
      toast({
        title: "Voice Assistant Active",
        description: "Listening for your weather question...",
      });
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/30 to-pink-900/40 backdrop-blur-xl border-white/20">
        <CardContent className="p-4 text-center">
          <p className="text-white/70 text-sm">Voice assistant not supported in this browser</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900/40 via-purple-900/30 to-pink-900/40 backdrop-blur-xl border-white/20 shadow-2xl">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`relative ${isListening ? 'animate-pulse' : ''}`}>
              <Button
                size="lg"
                onClick={isListening ? stopListening : startListening}
                className={`
                  rounded-full w-16 h-16 transition-all duration-300 transform hover:scale-110
                  ${isListening 
                    ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-500/50'
                  } shadow-2xl
                `}
              >
                {isListening ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </Button>
              
              {isListening && (
                <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping"></div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-semibold text-lg flex items-center justify-center">
              <Volume2 className="w-5 h-5 mr-2 text-purple-400" />
              Voice Weather Assistant
            </h3>
            <p className="text-white/70 text-sm">
              {isListening 
                ? "Listening... Ask me about the weather!" 
                : "Tap to ask about weather conditions"
              }
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 border border-white/20">
            <p className="text-white/80 text-xs">
              Try saying: "What's the weather?", "Tell me the temperature", "How's the humidity?"
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
