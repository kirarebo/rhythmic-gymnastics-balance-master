
import React from 'react';
import { AnalysisResult } from './types';
import { SkeletonViewer } from './SkeletonViewer';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface ResultsProps { result: AnalysisResult; expertUrl: string; learnerUrl: string; onReset: () => void; }

export const Results: React.FC<ResultsProps> = ({ result, expertUrl, learnerUrl, onReset }) => {
  const chartData = [
    { subject: '安定性', A: result.scores.stability },
    { subject: '伸展', A: result.scores.extension },
    { subject: '姿勢', A: result.scores.posture },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-2xl font-bold">分析結果: {result.poseName}</h2>
        <button onClick={onReset} className="px-6 py-2 bg-slate-100 rounded-lg">リセット</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonViewer imageUrl={expertUrl} skeleton={result.expertSkeleton} label="お手本" color="#10b981" />
        <SkeletonViewer imageUrl={learnerUrl} skeleton={result.learnerSkeleton} label="あなた" color="#6366f1" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold mb-4">スコア</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border space-y-4">
          <h3 className="font-bold">アドバイス</h3>
          {result.feedback.map((f, i) => <p key={i} className="text-slate-700 bg-slate-50 p-3 rounded-lg">{f}</p>)}
        </div>
      </div>
    </div>
  );
};
