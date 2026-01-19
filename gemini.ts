
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "./types";

export const analyzeCoaching = async (expertBase64: string, learnerBase64: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    新体操のコーチとして、2枚の画像を比較分析してください。
    1枚目はお手本、2枚目は練習生です。
    練習生への改善アドバイスを日本語のJSON形式で返してください。
    - poseName: ポーズの名前
    - scores: stability(安定性), extension(伸展), posture(姿勢)の3項目（各10点満点）
    - feedback: 具体的なアドバイスを3つ
    - angleDifferences: 角度や形の違いについての指摘
    - requiredMuscles: 強化すべき筋肉名
    - trainingExercises: 推奨トレーニング2つ（titleとdescription）
  `;

  const cleanExpert = expertBase64.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");
  const cleanLearner = learnerBase64.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

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
            properties: { stability: { type: Type.NUMBER }, extension: { type: Type.NUMBER }, posture: { type: Type.NUMBER } },
            required: ["stability", "extension", "posture"]
          },
          feedback: { type: Type.ARRAY, items: { type: Type.STRING } },
          angleDifferences: { type: Type.ARRAY, items: { type: Type.STRING } },
          requiredMuscles: { type: Type.ARRAY, items: { type: Type.STRING } },
          trainingExercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { title: { type: Type.STRING }, description: { type: Type.STRING } },
              required: ["title", "description"]
            }
          }
        },
        required: ["poseName", "scores", "feedback", "angleDifferences", "requiredMuscles", "trainingExercises"]
      }
    },
  });

  return JSON.parse(response.text?.trim() || "{}");
};
