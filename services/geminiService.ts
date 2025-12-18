import { GoogleGenAI } from "@google/genai";
import { EditResult } from "../types";

// DEMO MODE: không có key thì không gọi Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const editImageWithGemini = async (
  imageBase64: string,
  mimeType: string,
  prompt: string,
  referenceImage?: { data: string; mimeType: string },
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1"
): Promise<EditResult> => {

  // 👉 KHÔNG CÓ KEY → CHẠY DEMO, KHÔNG CRASH
  if (!ai) {
    console.warn("Gemini disabled – demo mode");
    return {
      imageData: imageBase64,
      mimeType,
    };
  }

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const parts: any[] = [
      { inlineData: { data: cleanBase64, mimeType } },
      { text: prompt },
    ];

    if (referenceImage) {
      const cleanRef = referenceImage.data.replace(/^data:image\/[a-z]+;base64,/, "");
      parts.splice(1, 0, {
        inlineData: { data: cleanRef, mimeType: referenceImage.mimeType },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: { parts },
      config: { imageConfig: { aspectRatio } },
    });

    const responseParts = response.candidates?.[0]?.content?.parts;

    if (!responseParts) {
      return { imageData: imageBase64, mimeType };
    }

    for (const part of responseParts) {
      if (part.inlineData?.data) {
        return {
          imageData: `data:image/png;base64,${part.inlineData.data}`,
          mimeType: "image/png",
        };
      }
    }

    return { imageData: imageBase64, mimeType };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { imageData: imageBase64, mimeType };
  }
};
