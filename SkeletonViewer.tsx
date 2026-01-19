
import React from 'react';
import { Skeleton } from './types';

interface SkeletonViewerProps {
  imageUrl: string;
  skeleton: Skeleton;
  label: string;
  color: string;
}

export const SkeletonViewer: React.FC<SkeletonViewerProps> = ({ imageUrl, skeleton, label, color }) => {
  const linesToDraw: {x1: number, y1: number, x2: number, y2: number}[] = [];
  const points = skeleton.points;

  const getP = (name: string) => points.find(p => p.label.includes(name));

  const pairs = [
    [getP('left shoulder'), getP('left elbow')], [getP('left elbow'), getP('left wrist')],
    [getP('right shoulder'), getP('right elbow')], [getP('right elbow'), getP('right wrist')],
    [getP('left shoulder'), getP('right shoulder')],
    [getP('left shoulder'), getP('left hip')], [getP('right shoulder'), getP('right hip')],
    [getP('left hip'), getP('right hip')],
    [getP('left hip'), getP('left knee')], [getP('left knee'), getgetP('left ankle')],
    [getP('right hip'), getP('right knee')], [getP('right knee'), getgetP('right ankle')]
  ];

  // Helper inside to avoid error if undefined
  function getgetP(name: string) { return points.find(p => p.label.includes(name)); }

  pairs.forEach(([p1, p2]) => {
    if (p1 && p2) linesToDraw.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
  });

  return (
    <div className="relative w-full aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden shadow-lg border-2 border-white">
      <img src={imageUrl} alt={label} className="absolute inset-0 w-full h-full object-contain opacity-60" />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {linesToDraw.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="1" strokeLinecap="round" />
        ))}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.5" fill={color} />
        ))}
      </svg>
      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {label}
      </div>
    </div>
  );
};
