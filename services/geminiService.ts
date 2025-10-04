import { GoogleGenAI, Type } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface CategorizedHashtags {
  popular: string[];
  niche: string[];
  community: string[];
  trending: string[];
  [key: string]: string[];
}

const schema = {
  type: Type.OBJECT,
  properties: {
    popular: {
      type: Type.ARRAY,
      description: "Popular, high-volume hashtags for broad reach.",
      items: { type: Type.STRING }
    },
    niche: {
        type: Type.ARRAY,
        description: "Specific, targeted hashtags for a smaller, more relevant audience.",
        items: { type: Type.STRING }
    },
    community: {
        type: Type.ARRAY,
        description: "Hashtags used by specific online communities related to the topic.",
        items: { type: Type.STRING }
    },
    trending: {
        type: Type.ARRAY,
        description: "Currently trending or viral hashtags related to the topic. If none, this can be an empty array.",
        items: { type: Type.STRING }
    },
  },
  required: ['popular', 'niche', 'community', 'trending']
};

export const generateHashtags = async (topic: string): Promise<CategorizedHashtags> => {
  const prompt = `You are a social media marketing expert. For the topic "${topic}", generate a list of relevant hashtags suitable for platforms like Instagram, X (formerly Twitter), and TikTok. Categorize them into four groups: 'popular' (high-volume, broad reach), 'niche' (specific, targeted), 'community' (used by specific online groups), and 'trending' (currently viral or time-sensitive). Return the result as a JSON object with keys for each category, where each key holds an array of 5-7 hashtag strings. Do not include the '#' prefix in the strings.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);

    if (parsed && parsed.popular && parsed.niche) {
        return parsed;
    } else {
        throw new Error("Invalid response format from API.");
    }
  } catch (error) {
    console.error("Error generating hashtags:", error);
    throw new Error("Could not connect to the AI service. Please try again later.");
  }
};