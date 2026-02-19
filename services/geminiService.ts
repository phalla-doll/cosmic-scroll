import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generatePlanetFact = async (planetName: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Unable to fetch AI facts.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `Give me a fascinating, short, one-sentence scientific fact about the planet ${planetName} that most people don't know. Keep it under 20 words.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text?.trim() || `Could not retrieve data for ${planetName}.`;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The stars are silent today (API Error).";
  }
};
