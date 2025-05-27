
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
    size: number;
    type: string;
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
      const conditionLower = condition.toLowerCase();
      let particleType = 'default';
      let count = 0;
      
      if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        particleType = 'rain';
        count = 60;
      } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
        particleType = 'storm';
        count = 80;
      } else if (conditionLower.includes('snow')) {
        particleType = 'snow';
        count = 40;
      } else if (conditionLower.includes('cloud')) {
        particleType = 'cloud';
        count = 25;
      } else if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
        particleType = 'sun';
        count = 15;
      }
      
      return {
        x: Math.random() * canvas.width,
        y: -20,
        vx: particleType === 'storm' ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 3,
        vy: particleType === 'rain' ? Math.random() * 12 + 6 : 
            particleType === 'snow' ? Math.random() * 3 + 1 :
            particleType === 'storm' ? Math.random() * 15 + 8 : 
            Math.random() * 4 + 2,
        life: 1,
        opacity: Math.random() * 0.8 + 0.2,
        size: particleType === 'snow' ? Math.random() * 6 + 3 : 
              particleType === 'cloud' ? Math.random() * 8 + 4 : 
              Math.random() * 3 + 1,
        type: particleType
      };
    };

    const updateParticles = () => {
      particles.current = particles.current.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.type === 'snow') {
          particle.vx += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.1;
        }
        
        particle.life -= particle.type === 'cloud' ? 0.005 : 0.012;
        particle.opacity = particle.life;

        return particle.life > 0 && particle.y < canvas.height + 20;
      });

      // Add new particles based on intensity and condition
      const maxParticles = Math.floor(intensity * (condition.toLowerCase().includes('storm') ? 50 : 30));
      while (particles.current.length < maxParticles && Math.random() < 0.7) {
        particles.current.push(createParticle());
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        switch (particle.type) {
          case 'rain':
            // Enhanced rain drops with gradient
            const rainGradient = ctx.createLinearGradient(
              particle.x, particle.y - particle.size,
              particle.x, particle.y + particle.size
            );
            rainGradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
            rainGradient.addColorStop(1, 'rgba(147, 197, 253, 0.4)');
            ctx.strokeStyle = rainGradient;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x - particle.vx * 4, particle.y - particle.vy * 4);
            ctx.stroke();
            break;

          case 'snow':
            // Realistic snowflakes
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.beginPath();
            
            // Draw snowflake shape
            const spikes = 6;
            const outerRadius = particle.size;
            const innerRadius = outerRadius * 0.4;
            
            for (let i = 0; i < spikes * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (i / (spikes * 2)) * Math.PI * 2;
              const x = particle.x + Math.cos(angle) * radius;
              const y = particle.y + Math.sin(angle) * radius;
              
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            break;

          case 'storm':
            // Electric storm particles with glow
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 15;
            ctx.fillStyle = particle.life > 0.7 ? '#a855f7' : '#e879f9';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add lightning-like trails occasionally
            if (Math.random() < 0.1) {
              ctx.strokeStyle = '#fbbf24';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(
                particle.x + (Math.random() - 0.5) * 20,
                particle.y + (Math.random() - 0.5) * 20
              );
              ctx.stroke();
            }
            break;

          case 'cloud':
            // Fluffy cloud particles
            ctx.fillStyle = `rgba(229, 231, 235, ${particle.opacity * 0.6})`;
            ctx.beginPath();
            
            // Draw multiple overlapping circles for cloud effect
            for (let i = 0; i < 3; i++) {
              const offsetX = (Math.random() - 0.5) * particle.size;
              const offsetY = (Math.random() - 0.5) * particle.size;
              ctx.arc(
                particle.x + offsetX, 
                particle.y + offsetY, 
                particle.size * (0.5 + Math.random() * 0.5), 
                0, 
                2 * Math.PI
              );
            }
            ctx.fill();
            break;

          case 'sun':
            // Sun rays and sparkles
            ctx.fillStyle = `rgba(251, 191, 36, ${particle.opacity})`;
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add sparkle effect
            if (Math.random() < 0.3) {
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = 1;
              const rayLength = particle.size * 2;
              for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2 + Date.now() * 0.001;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(
                  particle.x + Math.cos(angle) * rayLength,
                  particle.y + Math.sin(angle) * rayLength
                );
                ctx.stroke();
              }
            }
            break;
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
