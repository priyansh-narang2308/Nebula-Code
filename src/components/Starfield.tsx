
import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
}

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to fit window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create stars
    const stars: Star[] = [];
    const starCount = 200;
    const maxDepth = 1000;
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * 2000 - 1000,
        y: Math.random() * 2000 - 1000,
        z: Math.random() * maxDepth,
        size: 1 + Math.random() * 2,
        opacity: Math.random(),
        speed: 0.5 + Math.random() * 1.5
      });
    }
    
    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 25, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Update and draw stars
      stars.forEach(star => {
        // Move star
        star.z -= star.speed;
        
        // Reset if star moves out of the screen
        if (star.z <= 0) {
          star.z = maxDepth;
          star.x = Math.random() * 2000 - 1000;
          star.y = Math.random() * 2000 - 1000;
        }
        
        // Calculate 2D position based on 3D coordinates
        const scale = maxDepth / star.z;
        const x2d = centerX + star.x * scale;
        const y2d = centerY + star.y * scale;
        
        // Calculate size based on depth
        const size = star.size * scale;
        
        // Calculate opacity based on depth
        const opacity = star.opacity * (1 - star.z / maxDepth);
        
        // Draw star
        if (x2d >= 0 && x2d < canvas.width && y2d >= 0 && y2d < canvas.height) {
          ctx.beginPath();
          ctx.arc(x2d, y2d, size / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
          
          // Add glow effect to larger stars
          if (size > 1.5) {
            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(155, 135, 245, ${opacity * 0.3})`;
            ctx.fill();
          }
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 -z-10 w-full h-full"
    />
  );
};

export default Starfield;
