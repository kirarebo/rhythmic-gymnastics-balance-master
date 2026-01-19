
import React, { useState } from 'react';
import { ImageInput } from './ImageInput';
import { Results } from './Results';
import { analyzeCoaching } from './gemini';
import { detectSkeleton } from './pose';
import { ImageState, AnalysisResult } from './types';
import { Activity } from 'lucide-react';

const App: React.FC = () => {
  const [expertImage, setExpertImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null });
  const [learnerImage, setLearnerImage] = useState<ImageState>({ file: null, previewUrl: null, base64: null });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!expertImage.base64 || !learnerImage.base64 || !expertImage.previewUrl || !learnerImage.previewUrl) return;
    setIsAnalyzing(true);
    setError(null);
    let step = "init";
    try {
      step = "skeleton";
      const expertSkeleton = await detectSkeleton(expertImage.previewUrl);
      const learnerSkeleton = await detectSkeleton(learnerImage.previewUrl);
      step = "ai";
      const coachingData = await analyzeCoaching(expertImage.base64, learnerImage.base64);
      setResult({ ...coachingData, expertSkeleton, learnerSkeleton });
    } catch (err: any) {
      console.error(err);
      setError(step === "skeleton" ? "骨格の検出に失敗しました。人物がはっきり写っている画像を選んでください。" : "AI分析に失敗しました。APIキーが正しいか確認してください。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setExpertImage({ file: null, previewUrl: null, base64: null });
    setLearnerImage({ file: null, previewUrl: null, base64: null });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Activity className="text-indigo-600 w-6 h-6" />
          <span className="font-bold text-xl">RG Balance Master</span>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {!result ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-lg font-bold mb-6 text-center text-slate-700">お手本と自分のポーズを比較分析</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageInput label="お手本の画像（上手な選手）" imageState={expertImage} onChange={(f,p,b)=>setExpertImage({file:f, previewUrl:p, base64:b})} />
              <ImageInput label="練習生の画像（あなた）" imageState={learnerImage} onChange={(f,p,b)=>setLearnerImage({file:f, previewUrl:p, base64:b})} />
            </div>
            {error && <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
            <div className="mt-8 flex justify-center">
              <button 
                onClick={handleAnalyze} 
                disabled={!expertImage.base64 || !learnerImage.base64 || isAnalyzing} 
                className={`px-10 py-4 rounded-xl font-bold text-white transition-all ${isAnalyzing ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'}`}
              >
                {isAnalyzing ? "AIが分析しています..." : "分析を開始する"}
              </button>
            </div>
          </div>
        ) : (
          <Results result={result} expertUrl={expertImage.previewUrl!} learnerUrl={learnerImage.previewUrl!} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};
export default App;
