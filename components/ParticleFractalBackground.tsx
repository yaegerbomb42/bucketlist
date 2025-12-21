import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
  fractalDepth: number;
}

interface FractalNode {
  x: number;
  y: number;
  size: number;
  angle: number;
  depth: number;
  hue: number;
  opacity: number;
}

export const ParticleFractalBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const fractalNodesRef = useRef<FractalNode[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      hue: Math.random() * 360,
      life: 0,
      maxLife: Math.random() * 1000 + 500,
      fractalDepth: Math.floor(Math.random() * 3) + 1,
    };
  };

  // Create fractal tree structure
  const createFractalNode = (x: number, y: number, depth: number = 0): FractalNode => {
    return {
      x,
      y,
      size: Math.random() * 20 + 5,
      angle: Math.random() * Math.PI * 2,
      depth,
      hue: (Math.random() * 60 + 200) % 360, // Blues and purples
      opacity: Math.max(0.1, 0.8 - depth * 0.2),
    };
  };

  // Generate fractal branches
  const generateFractalBranches = (node: FractalNode, maxDepth: number = 4): FractalNode[] => {
    if (node.depth >= maxDepth) return [node];
    
    const branches: FractalNode[] = [node];
    const branchCount = Math.floor(Math.random() * 3) + 2;
    
    for (let i = 0; i < branchCount; i++) {
      const angleOffset = (Math.PI * 2 / branchCount) * i + Math.random() * 0.5;
      const distance = node.size * (2 + Math.random());
      const newX = node.x + Math.cos(node.angle + angleOffset) * distance;
      const newY = node.y + Math.sin(node.angle + angleOffset) * distance;
      
      const childNode = createFractalNode(newX, newY, node.depth + 1);
      childNode.hue = (node.hue + Math.random() * 60 - 30) % 360;
      
      branches.push(...generateFractalBranches(childNode, maxDepth));
    }
    
    return branches;
  };

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setDimensions({ width: canvas.width, height: canvas.height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Create initial particles
    particlesRef.current = Array.from({ length: 80 }, () => createParticle(canvas));
    
    // Create initial fractal nodes
    fractalNodesRef.current = [];
    for (let i = 0; i < 5; i++) {
      const rootNode = createFractalNode(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      );
      fractalNodesRef.current.push(...generateFractalBranches(rootNode, 3));
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        isMoving: true,
      };
      
      // Clear the moving flag after a delay
      setTimeout(() => {
        mouseRef.current.isMoving = false;
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (timestamp: number) => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(5, 5, 16, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Mouse interaction
        if (mouseRef.current.isMoving) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const force = (150 - distance) / 150;
            particle.vx += (dx / distance) * force * 0.01;
            particle.vy += (dy / distance) * force * 0.01;
            particle.hue = (particle.hue + 2) % 360;
          }
        }

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Lifecycle management
        if (particle.life > particle.maxLife) {
          particlesRef.current[index] = createParticle(canvas);
          return;
        }

        // Draw particle with fractal effect
        const lifeRatio = particle.life / particle.maxLife;
        const currentOpacity = particle.opacity * (1 - lifeRatio);
        
        ctx.save();
        ctx.globalAlpha = currentOpacity;
        
        // Main particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.fill();
        
        // Fractal trails
        for (let i = 1; i <= particle.fractalDepth; i++) {
          const trailX = particle.x - particle.vx * i * 10;
          const trailY = particle.y - particle.vy * i * 10;
          const trailSize = particle.size * (1 - i * 0.2);
          const trailOpacity = currentOpacity * (1 - i * 0.3);
          
          ctx.globalAlpha = trailOpacity;
          ctx.beginPath();
          ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = `hsl(${(particle.hue + i * 30) % 360}, 60%, 50%)`;
          ctx.fill();
        }
        
        ctx.restore();
      });

      // Update and draw fractal nodes
      fractalNodesRef.current.forEach((node, index) => {
        // Slowly rotate and pulse
        node.angle += 0.005;
        node.size = Math.abs(Math.sin(timestamp * 0.001 + index)) * 10 + 5;
        
        // Draw fractal node
        ctx.save();
        ctx.globalAlpha = node.opacity;
        ctx.translate(node.x, node.y);
        ctx.rotate(node.angle);
        
        // Draw geometric shape
        ctx.beginPath();
        const sides = 6;
        for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const x = Math.cos(angle) * node.size;
          const y = Math.sin(angle) * node.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, node.size);
        gradient.addColorStop(0, `hsla(${node.hue}, 80%, 60%, 0.8)`);
        gradient.addColorStop(1, `hsla(${node.hue}, 80%, 60%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.restore();
      });

      // Draw connections between nearby particles
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.globalAlpha = (100 - distance) / 100 * 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'linear-gradient(135deg, #050510 0%, #0a0a1a 50%, #1a0a2e 100%)',
      }}
    />
  );
};
