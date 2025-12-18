import { GoogleGenAI } from "@google/genai";
import { EditResult } from "../types";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image using Gemini 2.5 Flash Image model.
 * @param imageBase64 The base64 encoded string of the source image.
 * @param mimeType The mime type of the source image.
 * @param prompt The text description of the edits to perform.
 * @param referenceImage Optional reference image to guide the generation.
 * @param aspectRatio Optional aspect ratio for the output image.
 */
export const editImageWithGemini = async (
  imageBase64: string,
  mimeType: string,
  prompt: string,
  referenceImage?: { data: string; mimeType: string },
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1"
): Promise<EditResult> => {
  try {
    // Clean base64 string if it contains the data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

    const parts: any[] = [
      {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType,
        },
      },
      {
        text: prompt,
      },
    ];

    // Insert reference image if provided
    if (referenceImage) {
      const cleanRef = referenceImage.data.replace(/^data:image\/[a-z]+;base64,/, "");
      parts.splice(1, 0, {
        inlineData: {
          data: cleanRef,
          mimeType: referenceImage.mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    // Iterate through parts to find the image
    const responseParts = response.candidates?.[0]?.content?.parts;
    
    if (!responseParts) {
      throw new Error("No content generated from the model.");
    }

    let generatedImage: string | null = null;

    for (const part of responseParts) {
      if (part.inlineData) {
        generatedImage = part.inlineData.data;
        return {
          imageData: `data:image/png;base64,${generatedImage}`,
          mimeType: 'image/png'
        };
      }
    }

    throw new Error("The model did not return an image. It might have refused the request due to safety or validity.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};