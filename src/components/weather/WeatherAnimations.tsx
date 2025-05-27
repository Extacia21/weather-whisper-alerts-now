
import React, { useEffect, useRef } from 'react';

interface WeatherAnimationsProps {
  condition: string;
  intensity?: number;
  className?: string;
}

export const WeatherAnimations: React.FC<WeatherAnimationsProps> = ({ 
  condition, 
  intensity = 1, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particles = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    opacity: number;
  }>>([]);

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
    window.addEventListener('resize', resizeCanvas);

    const createParticle = () => {
      const baseCount = condition.toLowerCase().includes('rain') ? 50 : 
                       condition.toLowerCase().includes('storm') ? 80 : 
                       condition.toLowerCase().includes('cloud') ? 20 : 0;
      
      return {
        x: Math.random() * canvas.width,
        y: -10,
        vx: condition.toLowerCase().includes('storm') ? (Math.random() - 0.5) * 4 : (Math.random() - 0.5) * 2,
        vy: condition.toLowerCase().includes('rain') ? Math.random() * 8 + 4 : Math.random() * 3 + 1,
        life: 1,
        opacity: Math.random() * 0.8 + 0.2
      };
    };

    const updateParticles = () => {
      particles.current = particles.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.01;
        particle.opacity = particle.life;

        return particle.life > 0 && particle.y < canvas.height + 10;
      });

      // Add new particles
      const maxParticles = Math.floor(intensity * 30);
      while (particles.current.length < maxParticles && Math.random() < 0.8) {
        particles.current.push(createParticle());
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        if (condition.toLowerCase().includes('rain')) {
          // Rain drops
          ctx.strokeStyle = '#4FC3F7';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3);
          ctx.stroke();
        } else if (condition.toLowerCase().includes('storm')) {
          // Lightning particles
          ctx.fillStyle = particle.life > 0.7 ? '#9C27B0' : '#E1BEE7';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, Math.random() * 3 + 1, 0, 2 * Math.PI);
          ctx.fill();
        } else if (condition.toLowerCase().includes('cloud')) {
          // Cloud particles
          ctx.fillStyle = '#E0E0E0';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, Math.random() * 5 + 2, 0, 2 * Math.PI);
          ctx.fill();
        }

        ctx.restore();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [condition, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-10 ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
