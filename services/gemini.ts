
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Scores, TrainingExercise } from "../types";

interface GeminiAnalysis {
  poseName: string;
  scores: Scores;
  feedback: string[];
  angleDifferences: string[];
  requiredMuscles: string[];
  trainingExercises: TrainingExercise[];
}

export const analyzeCoaching = async (
  expertBase64: string,
  learnerBase64: string
): Promise<GeminiAnalysis> => {
  // Always create a new GoogleGenAI instance right before making an API call 
  // to ensure it uses the most up-to-date API key from the environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    あなたは新体操のナショナルチームコーチ兼、スポーツバイオメカニクスの専門家です。
    2枚の画像（1枚目：お手本、2枚目：練習生）を精密に分析し、以下の情報を日本語のJSONで回答してください。

    1. ポーズの特定（例：パンシェ、アラベスク等）。
    2. スコアリング：10点満点（安定性、伸展、姿勢）。
    3. 具体的アドバイス：実践的なコーチングメッセージを3つ。
    4. 身体的分析：
       - 【強化すべき筋肉】：このポーズを安定させるために練習生に不足している、または強化すべき具体的な筋肉名（例：腸腰筋、腹横筋、中殿筋、脊柱起立筋など）を3つ挙げてください。
       - 【トレーニングメニュー】：上記の筋肉を鍛え、この課題を克服するための具体的な練習方法を2つ提案してください。
    5. 改善ポイント：重心の位置や関節の角度に関する短い指摘。

    回答は必ず指定されたJSONスキーマに従ってください。
  `;

  const cleanExpert = expertBase64.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");
  const cleanLearner = learnerBase64.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanExpert } },
          { inlineData: { mimeType: "image/jpeg", data: cleanLearner } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            poseName: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                stability: { type: Type.NUMBER },
                extension: { type: Type.NUMBER },
                posture: { type: Type.NUMBER },
              },
              required: ["stability", "extension", "posture"],
            },
            feedback: { type: Type.ARRAY, items: { type: Type.STRING } },
            angleDifferences: { type: Type.ARRAY, items: { type: Type.STRING } },
            requiredMuscles: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "筋肉名（日本語）"
            },
            trainingExercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "メニュー名" },
                  description: { type: Type.STRING, description: "具体的なやり方と回数目安" },
                },
                required: ["title", "description"],
              },
            },
          },
          required: ["poseName", "scores", "feedback", "angleDifferences", "requiredMuscles", "trainingExercises"],
        },
      },
    });

    // Access the .text property directly (do not call as a method)
    const text = response.text?.trim();
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as GeminiAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
