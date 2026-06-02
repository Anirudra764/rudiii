/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  isPlaying: boolean;
  activeTrackId?: string;
}

export default function Visualizer({ isPlaying, activeTrackId }: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Initialize stars/particles
    const particleCount = 70;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      phase: number;
    }> = [];

    const colors = [
      'rgba(212, 175, 55, 0.4)',  // Gold
      'rgba(138, 43, 226, 0.4)', // Purple
      'rgba(227, 38, 54, 0.4)',  // Red
      'rgba(255, 255, 255, 0.3)' // White
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2
      });
    }

    let audioWavesOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse Parallax Offset
      const targetOffX = mouseRef.current.x * 0.5;
      const targetOffY = mouseRef.current.y * 0.5;

      // Draw faint background ambient glow
      const grad = ctx.createRadialGradient(
        width / 2 + targetOffX,
        height / 2 + targetOffY,
        10,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      grad.addColorStop(0, '#100c1e');
      grad.addColorStop(0.5, '#0c0714');
      grad.addColorStop(1, '#050409');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Particles
      particles.forEach((p, index) => {
        p.phase += isPlaying ? 0.05 : 0.01;
        const speedMultiplier = isPlaying ? 2.5 : 1.0;

        p.x += p.speedX * speedMultiplier;
        p.y += p.speedY * speedMultiplier;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Oscillate size
        const sizeOffset = Math.sin(p.phase) * 0.8;
        const currentSize = Math.max(0.5, p.size + sizeOffset);

        // Parallax depth positioning
        const itemX = p.x + targetOffX * (p.size * 0.3);
        const itemY = p.y + targetOffY * (p.size * 0.3);

        ctx.beginPath();
        ctx.arc(itemX, itemY, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = isPlaying ? 8 : 2;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Ambient Audio Sinewaves at the bottom
      if (isPlaying) {
        audioWavesOffset += 0.08;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.07)';
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x += 10) {
          const y = height * 0.9 + Math.sin(x * 0.005 + audioWavesOffset) * 40 * Math.sin(x * 0.002);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.09)';
        ctx.lineWidth = 1.5;

        for (let x = 0; x < width; x += 10) {
          const y = height * 0.88 + Math.cos(x * 0.008 - audioWavesOffset * 1.2) * 25 * Math.sin(x * 0.0015);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, activeTrackId]);

  return (
    <canvas
      id="cosmic-mesh-visualizer"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
