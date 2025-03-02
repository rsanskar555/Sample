"use client";

import { useState, useRef, useEffect } from "react";
import { Heart, Music, Volume2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Home() {
  const [count, setCount] = useState(0);
  const [chants, setChants] = useState<Array<{id: number, text: string, position: {x: number, y: number}}>>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current = new Audio("/radha-chant.mp3");
    
    // Check user's preferred color scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
    
    // Add particles to background
    const createParticle = () => {
      if (!backgroundRef.current) return;
      
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      const size = Math.random() * 10 + 5;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = (Math.random() * 0.5 + 0.1).toString();
      particle.style.animation = `float-particle ${duration}s linear ${delay}s infinite`;
      
      backgroundRef.current.appendChild(particle);
      
      setTimeout(() => {
        if (backgroundRef.current && backgroundRef.current.contains(particle)) {
          backgroundRef.current.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    };
    
    // Create initial particles
    for (let i = 0; i < 20; i++) {
      createParticle();
    }
    
    // Create new particles periodically
    const particleInterval = setInterval(() => {
      createParticle();
    }, 2000);
    
    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  const handleChant = () => {
    setCount((prevCount) => prevCount + 1);
    
    // Play audio if not muted
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    
    // Add new chant with random position
    const newChant = {
      id: Date.now(),
      text: "राधा", // Hindi for Radha
      position: {
        x: Math.random() * 80 + 10, // 10% to 90% of container width
        y: Math.random() * 80 + 10, // 10% to 90% of container height
      },
    };
    
    setChants((prev) => [...prev.slice(-19), newChant]);
    
    // Trigger animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 300);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode 
        ? "bg-gradient-to-b from-purple-900 to-indigo-900" 
        : "bg-gradient-to-b from-amber-50 to-orange-100"
    } flex flex-col items-center justify-center p-4 relative overflow-hidden`}>
      {/* Background particles */}
      <div 
        ref={backgroundRef} 
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      ></div>
      
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute}
                className={`rounded-full ${isDarkMode ? "text-white/70 hover:text-white" : "text-amber-800/70 hover:text-amber-800"}`}
              >
                {isMuted ? <Music className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMuted ? "Unmute" : "Mute"} chant sound</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleDarkMode}
                className={`rounded-full ${isDarkMode ? "text-white/70 hover:text-white" : "text-amber-800/70 hover:text-amber-800"}`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle {isDarkMode ? "light" : "dark"} mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="max-w-4xl w-full mx-auto text-center relative z-10">
        <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${
          isDarkMode ? "text-amber-300" : "text-amber-700"
        } transition-colors duration-500`}>
          राधा नाम जप
        </h1>
        
        <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
          isDarkMode ? "text-amber-100" : "text-amber-900"
        } transition-colors duration-500`}>
          राधा के दिव्य नाम के जप के माध्यम से दिव्य ऊर्जा से जुड़ने का क्षण लें
        </p>
        
        <Card className={`p-6 mb-8 ${
          isDarkMode 
            ? "bg-indigo-950/40 border-amber-700/30" 
            : "bg-white/80 border-amber-200"
        } backdrop-blur-sm shadow-lg relative overflow-hidden transition-colors duration-500`}>
          <div 
            ref={containerRef}
            className={`relative h-64 md:h-80 mb-6 ${
              isDarkMode 
                ? "bg-gradient-to-r from-indigo-900/50 to-purple-900/50" 
                : "bg-gradient-to-r from-amber-100 to-orange-50"
            } rounded-lg overflow-hidden transition-colors duration-500`}
          >
            {chants.map((chant) => (
              <div
                key={chant.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out animate-fadeOut font-bold"
                style={{
                  left: `${chant.position.x}%`,
                  top: `${chant.position.y}%`,
                  fontSize: `${Math.random() * 2 + 1.5}rem`,
                  opacity: 0.9,
                  color: isDarkMode
                    ? `hsl(${Math.floor(40 + Math.random() * 20)}, ${Math.floor(80 + Math.random() * 20)}%, ${Math.floor(60 + Math.random() * 20)}%)`
                    : `hsl(${Math.floor(30 + Math.random() * 30)}, ${Math.floor(80 + Math.random() * 20)}%, ${Math.floor(50 + Math.random() * 20)}%)`,
                  textShadow: isDarkMode
                    ? "0 0 10px rgba(255,215,0,0.5), 0 0 20px rgba(255,165,0,0.3)"
                    : "0 0 5px rgba(255,165,0,0.3)",
                  animation: "float 3s ease-out forwards",
                }}
              >
                {chant.text}
              </div>
            ))}
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`text-2xl md:text-3xl font-bold mb-4 ${
              isDarkMode ? "text-amber-300" : "text-amber-800"
            } transition-colors duration-500`}>
              <span className="mr-2">जप संख्या:</span>
              <span className={`${showAnimation ? "scale-125" : "scale-100"} inline-block transition-transform duration-300`}>
                {count}
              </span>
            </div>
            
            <div className="w-full mb-6">
              <Progress 
                value={count % 108} 
                max={108} 
                className={`h-3 ${isDarkMode ? "bg-indigo-800" : "bg-amber-100"} transition-colors duration-500`}
              />
              <div className="flex justify-between mt-1 text-xs">
                <span className={isDarkMode ? "text-amber-200/70" : "text-amber-700/70"}>0</span>
                <span className={isDarkMode ? "text-amber-200/70" : "text-amber-700/70"}>108</span>
              </div>
            </div>
            
            <Button
              onClick={handleChant}
              className={`${
                isDarkMode
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              } px-8 py-6 rounded-full text-xl font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center gap-2`}
            >
              <Heart className="h-5 w-5 text-white animate-pulse" />
              राधा नाम जप करें
            </Button>
          </div>
        </Card>
        
        <div className={`${
          isDarkMode ? "text-amber-200/80" : "text-amber-800"
        } text-sm md:text-base transition-colors duration-500`}>
          <p>राधा के नाम का प्रत्येक जप दिव्य आशीर्वाद लाता है।</p>
          <p className="mt-2">पारंपरिक अभ्यास 108 के सेट में जप करने का सुझाव देता है।</p>
          <p className={`mt-4 text-xs ${isDarkMode ? "text-amber-300/70" : "text-amber-700"}`}>
            <span className="block md:inline">भक्ति के साथ बनाया गया</span>
            <span className="hidden md:inline"> • </span>
            <span className="block md:inline">राधा की कृपा आप पर बनी रहे</span>
          </p>
        </div>
      </div>
    </div>
  );
}