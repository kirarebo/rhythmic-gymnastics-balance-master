import React from 'react';
import { Skeleton, Point } from '../types';

interface SkeletonViewerProps {
  imageUrl: string;
  skeleton: Skeleton;
  label: string;
  color: string;
}

export const SkeletonViewer: React.FC<SkeletonViewerProps> = ({ imageUrl, skeleton, label, color }) => {
  // Helper to connect points for a simple stick figure
  
  const findPoint = (name: string) => skeleton.points.find(p => p.label.toLowerCase().includes(name));

  const connections = [
    ['shoulder', 'elbow'],
    ['elbow', 'wrist'],
    ['shoulder', 'hip'], // spine approx
    ['hip', 'knee'],
    ['knee', 'ankle'],
    ['shoulder', 'shoulder'], // clavicle
    ['hip', 'hip'] // pelvis
  ];
  
  // Create a flattened list of lines to draw
  const linesToDraw: {x1: number, y1: number, x2: number, y2: number}[] = [];

  const points = skeleton.points;

  const leftShoulder = points.find(p => p.label.toLowerCase().includes('shoulder') && p.label.toLowerCase().includes('left'));
  const rightShoulder = points.find(p => p.label.toLowerCase().includes('shoulder') && p.label.toLowerCase().includes('right'));
  const leftElbow = points.find(p => p.label.toLowerCase().includes('elbow') && p.label.toLowerCase().includes('left'));
  const rightElbow = points.find(p => p.label.toLowerCase().includes('elbow') && p.label.toLowerCase().includes('right'));
  const leftWrist = points.find(p => p.label.toLowerCase().includes('wrist') && p.label.toLowerCase().includes('left'));
  const rightWrist = points.find(p => p.label.toLowerCase().includes('wrist') && p.label.toLowerCase().includes('right'));
  const leftHip = points.find(p => p.label.toLowerCase().includes('hip') && p.label.toLowerCase().includes('left'));
  const rightHip = points.find(p => p.label.toLowerCase().includes('hip') && p.label.toLowerCase().includes('right'));
  const leftKnee = points.find(p => p.label.toLowerCase().includes('knee') && p.label.toLowerCase().includes('left'));
  const rightKnee = points.find(p => p.label.toLowerCase().includes('knee') && p.label.toLowerCase().includes('right'));
  const leftAnkle = points.find(p => p.label.toLowerCase().includes('ankle') && p.label.toLowerCase().includes('left'));
  const rightAnkle = points.find(p => p.label.toLowerCase().includes('ankle') && p.label.toLowerCase().includes('right'));

  const pairs = [
    [leftShoulder, leftElbow], [leftElbow, leftWrist],
    [rightShoulder, rightElbow], [rightElbow, rightWrist],
    [leftShoulder, rightShoulder], 
    [leftShoulder, leftHip], [rightShoulder, rightHip],
    [leftHip, rightHip],
    [leftHip, leftKnee], [leftKnee, leftAnkle],
    [rightHip, rightKnee], [rightKnee, rightAnkle]
  ];

  pairs.forEach(([p1, p2]) => {
    if (p1 && p2) {
      linesToDraw.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    }
  });

  return (
    <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden shadow-md">
      <img src={imageUrl} alt={label} className="absolute inset-0 w-full h-full object-contain opacity-80" />
      <div className="absolute inset-0 pointer-events-none">
         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Draw Lines */}
            {linesToDraw.map((line, i) => (
              <line 
                key={i}
                x1={line.x1} y1={line.y1} 
                x2={line.x2} y2={line.y2} 
                stroke={color} 
                strokeWidth="0.8"
                strokeLinecap="round"
                className="drop-shadow-sm opacity-90"
              />
            ))}
            {/* Draw Points */}
            {skeleton.points.map((p, i) => (
              <circle 
                key={i} 
                cx={p.x} 
                cy={p.y} 
                r="1.2" 
                fill={color}
                className="drop-shadow-md"
              />
            ))}
            
            {/* Draw Center of Gravity (COG) */}
            {skeleton.cog && (
              <g>
                {/* Gravity Line */}
                <line 
                  x1={skeleton.cog.x} y1={skeleton.cog.y}
                  x2={skeleton.cog.x} y2={100}
                  stroke="#ef4444" // red-500
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  className="opacity-80"
                />
                {/* Target Marker */}
                <circle cx={skeleton.cog.x} cy={skeleton.cog.y} r="3" stroke="#ef4444" strokeWidth="1" fill="none" />
                <circle cx={skeleton.cog.x} cy={skeleton.cog.y} r="1" fill="#ef4444" />
                <text x={skeleton.cog.x + 4} y={skeleton.cog.y} fill="#ef4444" fontSize="3" fontWeight="bold">重心 (COG)</text>
              </g>
            )}
         </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <span className="text-white font-bold text-sm bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/20">
            {label}
        </span>
      </div>
    </div>
  );
};