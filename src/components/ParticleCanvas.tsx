import React, { useEffect, useRef } from 'react';

interface Segment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  angle: number;
  vAngle: number;
  p1: { x: number; y: number };
  p2: { x: number; y: number };
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Number of segments based on screen size (approx 35 to 55)
    const segmentCount = Math.floor(Math.min(width, height) / 22);
    const segments: Segment[] = [];

    for (let i = 0; i < segmentCount; i++) {
      const length = 32 + Math.random() * 48; // segment length
      const angle = Math.random() * Math.PI * 2;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const halfLen = length / 2;
      segments.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        length,
        angle,
        vAngle: (Math.random() - 0.5) * 0.008,
        p1: {
          x: x - Math.cos(angle) * halfLen,
          y: y - Math.sin(angle) * halfLen,
        },
        p2: {
          x: x + Math.cos(angle) * halfLen,
          y: y + Math.sin(angle) * halfLen,
        },
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle mathematical background grid ticks
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let gx = 0; gx < width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Update and compute endpoints for all line segments
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];

        // Move center
        seg.x += seg.vx;
        seg.y += seg.vy;
        seg.angle += seg.vAngle;

        // Wrap boundaries
        const margin = 50;
        if (seg.x < -margin) seg.x = width + margin;
        if (seg.x > width + margin) seg.x = -margin;
        if (seg.y < -margin) seg.y = height + margin;
        if (seg.y > height + margin) seg.y = -margin;

        // Mouse gentle repulsion
        if (mouse.active) {
          const mdx = seg.x - mouse.x;
          const mdy = seg.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140 && mdist > 0) {
            const force = (140 - mdist) / 140;
            seg.x += (mdx / mdist) * force * 1.5;
            seg.y += (mdy / mdist) * force * 1.5;
          }
        }

        const halfLen = seg.length / 2;
        seg.p1.x = seg.x - Math.cos(seg.angle) * halfLen;
        seg.p1.y = seg.y - Math.sin(seg.angle) * halfLen;
        seg.p2.x = seg.x + Math.cos(seg.angle) * halfLen;
        seg.p2.y = seg.y + Math.sin(seg.angle) * halfLen;
      }

      // Draw mathematical connectivity (lines connecting near endpoints)
      const connectDist = 85;
      ctx.lineWidth = 0.75;
      for (let i = 0; i < segments.length; i++) {
        const s1 = segments[i];
        for (let j = i + 1; j < segments.length; j++) {
          const s2 = segments[j];
          const pts1 = [s1.p1, s1.p2];
          const pts2 = [s2.p1, s2.p2];

          for (let pA of pts1) {
            for (let pB of pts2) {
              const dx = pA.x - pB.x;
              const dy = pA.y - pB.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < connectDist) {
                const alpha = (1 - dist / connectDist) * 0.18;
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.setLineDash([2, 4]); // Dashed connection indicating mathematical relation
                ctx.beginPath();
                ctx.moveTo(pA.x, pA.y);
                ctx.lineTo(pB.x, pB.y);
                ctx.stroke();
                ctx.setLineDash([]);
              }
            }
          }
        }
      }

      // Draw each segment with distinct points on each side [A, B]
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];

        // 1. Line segment [p1, p2]
        ctx.beginPath();
        ctx.moveTo(seg.p1.x, seg.p1.y);
        ctx.lineTo(seg.p2.x, seg.p2.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // 2. Vertex point on side 1 (A)
        ctx.beginPath();
        ctx.arc(seg.p1.x, seg.p1.y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // 3. Vertex point on side 2 (B)
        ctx.beginPath();
        ctx.arc(seg.p2.x, seg.p2.y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Subtle midpoint coordinate marker on every 3rd segment
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
