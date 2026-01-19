
export interface Point { x: number; y: number; label: string; }
export interface Skeleton { points: Point[]; cog?: Point; }
export interface Scores { stability: number; extension: number; posture: number; }
export interface TrainingExercise { title: string; description: string; }
export interface AnalysisResult {
  poseName: string;
  scores: Scores;
  feedback: string[];
  angleDifferences: string[];
  expertSkeleton: Skeleton;
  learnerSkeleton: Skeleton;
  requiredMuscles: string[];
  trainingExercises: TrainingExercise[];
}
export interface ImageState { file: File | null; previewUrl: string | null; base64: string | null; }
