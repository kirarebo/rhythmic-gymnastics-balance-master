
import React from 'react';
import { AnalysisResult } from '../types';
import { SkeletonViewer } from './SkeletonViewer';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, Dumbbell, Target } from 'lucide-react';

interface ResultsProps {
  result: AnalysisResult;
  expertUrl: string;
  learnerUrl: string;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ result, expertUrl, learnerUrl, onReset }) => {
  const chartData = [
    { subject: '安定性', A: result.scores.stability, fullMark: 10 },
    { subject: '柔軟性', A: result.scores.extension, fullMark: 10 },
    { subject: '姿勢', A: result.scores.posture, fullMark: 10 },
  ];

  const averageScore = ((result.scores.stability + result.scores.extension + result.scores.posture) / 3).toFixed(1);

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">分析結果: {result.poseName}</h2>
          <p className="text-slate-500">AIパーソナルコーチによる詳細レポート</p>
        </div>
        <button 
          onClick={onReset}
          className="mt-4 md:mt-0 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
        >
          新しい分析
        </button>
      </div>

      {/* Visual Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SkeletonViewer 
          imageUrl={expertUrl} 
          skeleton={result.expertSkeleton} 
          label="お手本 (Expert)" 
          color="#10b981" 
        />
        <SkeletonViewer 
          imageUrl={learnerUrl} 
          skeleton={result.learnerSkeleton} 
          label="練習生 (Learner)" 
          color="#6366f1" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats & Muscle Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
              <h3 className="font-bold text-lg text-slate-800 mb-4">総合評価</h3>
              <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Radar name="スコア" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                      </RadarChart>
                  </ResponsiveContainer>
              </div>
              <div className="text-center mt-2">
                  <span className="text-4xl font-extrabold text-indigo-600">{averageScore}</span>
                  <span className="text-slate-400 text-sm ml-1">/ 10.0</span>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-500" />
                強化すべき主要筋
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.requiredMuscles.map((muscle, idx) => (
                  <span key={idx} className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg text-sm font-bold border border-rose-100">
                    {muscle}
                  </span>
                ))}
              </div>
          </div>
        </div>

        {/* Advice & Training Column */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="text-indigo-500" />
                    コーチングアドバイス
                </h3>
                <div className="space-y-3">
                    {result.feedback.map((tip, idx) => (
                        <div key={idx} className="flex gap-3 p-4 bg-indigo-50/40 rounded-xl border border-indigo-50">
                            <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                            <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <Dumbbell className="text-emerald-500" />
                    推奨トレーニングメニュー
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.trainingExercises.map((ex, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                            <h4 className="font-bold text-emerald-900 text-sm mb-1">{ex.title}</h4>
                            <p className="text-emerald-800 text-xs leading-relaxed">{ex.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-bold mb-1">バイオメカニクス的指摘:</p>
                  <ul className="list-disc ml-4 space-y-1">
                    {result.angleDifferences.map((diff, idx) => (
                      <li key={idx}>{diff}</li>
                    ))}
                  </ul>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
