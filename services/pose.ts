import { Skeleton, Point } from '../types';

// Declare globals for the MediaPipe libraries loaded via script tags
declare global {
  interface Window {
    Pose: any;
    Camera: any;
  }
}

const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
};

// Simplified center of mass calculation based on segment weights
const calculateCOG = (landmarks: any[]): Point | undefined => {
  const getPoint = (idx: number) => landmarks[idx];
  
  // Weights (Approximation for visual feedback)
  // Hips/Torso is heaviest. 
  const segments = [
    { indices: [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP], weight: 0.40 }, // Pelvis area
    { indices: [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER], weight: 0.30 }, // Upper Trunk
    { indices: [POSE_LANDMARKS.LEFT_KNEE, POSE_LANDMARKS.RIGHT_KNEE], weight: 0.20 }, // Thighs
    { indices: [POSE_LANDMARKS.LEFT_ANKLE, POSE_LANDMARKS.RIGHT_ANKLE], weight: 0.10 }, // Calves
  ];

  let totalX = 0;
  let totalY = 0;
  let totalWeight = 0;

  segments.forEach(seg => {
    let validPoints = 0;
    let segX = 0;
    let segY = 0;

    seg.indices.forEach(idx => {
      const p = getPoint(idx);
      // Only include if visibility is good
      if (p && p.visibility > 0.5) {
        segX += p.x;
        segY += p.y;
        validPoints++;
      }
    });

    if (validPoints > 0) {
      // Average position for this segment pair
      const avgX = segX / validPoints;
      const avgY = segY / validPoints;
      
      totalX += avgX * seg.weight;
      totalY += avgY * seg.weight;
      totalWeight += seg.weight;
    }
  });

  if (totalWeight === 0) return undefined;

  return {
    x: (totalX / totalWeight) * 100,
    y: (totalY / totalWeight) * 100,
    label: 'Center of Gravity'
  };
};

const mapLandmarksToSkeleton = (landmarks: any[]): Skeleton => {
  const points: Point[] = [];
  
  Object.entries(POSE_LANDMARKS).forEach(([label, index]) => {
    const lm = landmarks[index];
    if (lm && lm.visibility > 0.5) {
      points.push({
        x: lm.x * 100, // Convert 0-1 to 0-100%
        y: lm.y * 100,
        label: label.toLowerCase().replace('_', ' ')
      });
    }
  });

  const cog = calculateCOG(landmarks);

  return { points, cog };
};

// Singleton instance to prevent re-initialization overhead
let poseInstance: any = null;

const getPoseInstance = async () => {
  if (poseInstance) return poseInstance;

  if (!window.Pose) {
    throw new Error("MediaPipe Pose library is not loaded. Please wait a moment or refresh.");
  }

  poseInstance = new window.Pose({
    locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });

  poseInstance.setOptions({
    // Changed to 2 (Heavy) for maximum precision in static analysis
    modelComplexity: 2, 
    smoothLandmarks: true,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
  });

  return poseInstance;
};

export const detectSkeleton = async (imageUrl: string): Promise<Skeleton> => {
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Skeleton detection timed out (20s). Try a smaller image."));
    }, 20000);

    try {
      const pose = await getPoseInstance();
      const img = new Image();
      img.src = imageUrl;

      img.onload = async () => {
        try {
          const onResults = (results: any) => {
             if (results.poseLandmarks) {
               resolve(mapLandmarksToSkeleton(results.poseLandmarks));
             } else {
               resolve({ points: [] });
             }
             clearTimeout(timeoutId);
          };

          pose.onResults(onResults);
          await pose.send({ image: img });
          
        } catch (error) {
          clearTimeout(timeoutId);
          reject(error);
        }
      };

      img.onerror = (e) => {
        clearTimeout(timeoutId);
        console.error("Image load error", e);
        reject(new Error("Failed to load image for skeleton detection."));
      };

    } catch (e) {
      clearTimeout(timeoutId);
      reject(e);
    }
  });
};