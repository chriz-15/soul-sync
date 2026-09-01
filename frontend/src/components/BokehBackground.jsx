import React, { useEffect, useRef } from 'react';

export default function BokehBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle array for bokeh circles & subtle glowing hearts
    const particleCount = 45;
    const particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.radius = Math.random() * 45 + 15;
        this.speedY = Math.random() * 0.7 + 0.25;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.35 + 0.15;
        this.isHeart = Math.random() > 0.45; // Mix of soft bokeh circles and heart particles
        this.scale = Math.random() * 0.8 + 0.4;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        if (this.y < -60) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.fillStyle = `rgba(255, 235, 240, ${this.opacity})`;
        ctx.shadowColor = 'rgba(255, 200, 215, 0.6)';
        ctx.shadowBlur = 20;

        if (this.isHeart) {
          // Draw heart
          ctx.translate(this.x, this.y);
          ctx.scale(this.scale * 0.8, this.scale * 0.8);
          ctx.beginPath();
          const topCurveHeight = this.radius * 0.3;
          ctx.moveTo(0, topCurveHeight);
          // top left curve
          ctx.bezierCurveTo(
            -this.radius / 2, -topCurveHeight,
            -this.radius, this.radius / 3,
            0, this.radius
          );
          // top right curve
          ctx.bezierCurveTo(
            this.radius, this.radius / 3,
            this.radius / 2, -topCurveHeight,
            0, topCurveHeight
          );
          ctx.fill();
        } else {
          // Draw soft bokeh circle
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height; // Spread initially
      particles.push(p);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="bokeh-canvas" />;
}
