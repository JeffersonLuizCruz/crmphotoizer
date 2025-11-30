import { GoogleGenAI, Type } from "@google/genai";
import { AIConceptResponse } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to prevent immediate crashes, handle checks later
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCreativeConcept = async (
  prompt: string
): Promise<AIConceptResponse | null> => {
  if (!ai) {
    console.error("API Key is missing");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a professional creative director for photography. 
      Generate a photoshoot concept based on this request: "${prompt}".
      Return the response in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A catchy title for the concept" },
            mood: { type: Type.STRING, description: "The emotional atmosphere" },
            lighting: { type: Type.STRING, description: "Lighting setup recommendations" },
            outfitSuggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3-4 outfit ideas" 
            },
            poseIdeas: {
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3-4 posing prompts"
            }
          },
          required: ["title", "mood", "lighting", "outfitSuggestions", "poseIdeas"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIConceptResponse;

  } catch (error) {
    console.error("Error generating concept:", error);
    throw error;
  }
};

export const generateClientEmail = async (
  clientName: string,
  scenario: string,
  tone: string
): Promise<string> => {
  if (!ai) return "Erro: Chave de API não configurada.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a email (in Portuguese) to a photography client named ${clientName}.
      Scenario: ${scenario}.
      Tone: ${tone}.
      Keep it professional but warm. Do not include subject line prefixes like 'Assunto:'. Just the body.`,
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating email:", error);
    return "Erro ao gerar email. Tente novamente.";
  }
};
