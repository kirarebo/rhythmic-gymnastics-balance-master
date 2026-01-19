
import { Skeleton } from './types';
declare global { interface Window { Pose: any; } }

export const detectSkeleton = async (imageUrl: string): Promise<Skeleton> => {
  if (!window.Pose) throw new Error("MediaPipeが読み込まれていません");

  const pose = new window.Pose({
    locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
  });
  
  pose.setOptions({ modelComplexity: 1, minDetectionConfidence: 0.5 });
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = async () => {
      pose.onResults((results: any) => {
        const points = (results.poseLandmarks || []).map((lm: any, i: number) => {
          const labels = ["nose", "left eye inner", "left eye", "left eye outer", "right eye inner", "right eye", "right eye outer", "left ear", "right ear", "mouth left", "mouth right", "left shoulder", "right shoulder", "left elbow", "right elbow", "left wrist", "right wrist", "left pinky", "right pinky", "left index", "right index", "left thumb", "right thumb", "left hip", "right hip", "left knee", "right knee", "left ankle", "right ankle", "left heel", "right heel", "left foot index", "right foot index"];
          return {
            x: lm.x * 100,
            y: lm.y * 100,
            label: labels[i] || `point-${i}`
          };
        });
        resolve({ points });
      });
      await pose.send({ image: img });
    };
    img.onerror = () => reject("画像の読み込みに失敗しました");
  });
};
