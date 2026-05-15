import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const getGenAI = () => {
  const key = (process.env.GEMINI_API_KEY || "").trim();
  return new GoogleGenerativeAI(key);
};

export type LinkedInMode = "Simple" | "Developer" | "Architect";

const PROMPTS = {
  Simple: "Write in a simple, easy-to-understand tone for a general audience interested in tech.",
  Developer: "Write in a moderately technical tone for software developers, focusing on implementation and tools.",
  Architect: "Write in a senior-level, system-oriented tone focusing on high-level architecture, trade-offs, and strategic implications.",
};

export const generateLinkedInPost = async (
  title: string,
  description: string,
  topics: string[],
  mode: LinkedInMode = "Architect",
  includeHashtags: boolean = true,
  isShortVersion: boolean = false
) => {
  if (!process.env.GEMINI_API_KEY) {
    // Mock response if no API key is provided
    let mock = `[MOCK POST - Mode: ${mode}${isShortVersion ? ' - SHORT' : ''}]\n\nMost ${topics[0] || 'tech'} products today are not just simple implementations anymore.\n\n${title} highlights a significant shift in how we approach systems.\n\nThis evolution is subtle, but important for our field.`;
    
    if (includeHashtags) {
      mock += `\n\n#${topics.slice(0, 3).join(' #') || 'Tech'}`;
    }
    return mock;
  }

  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a senior software engineer and AI architect.

Write a LinkedIn post based on the given article.
${PROMPTS[mode]}

DO NOT summarize the article.

Instead:
- extract the core idea
- explain it simply
- add technical insight
- add system-level thinking

Keep it:
- ${isShortVersion ? 'very concise (under 80 words)' : 'structured and clean (120–180 words)'}
- professional
- structured

${includeHashtags ? 'Add 3-5 relevant technical hashtags at the end.' : 'DO NOT use hashtags.'}

Article:
Title: ${title}
Description: ${description}
Topics: ${topics.join(", ")}`;

  try {
    // Targeting Gemini 2.5 Flash as confirmed by user's API dashboard
    let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (innerError: any) {
      console.warn("Gemini 2.0 Flash unavailable, falling back to 1.5 Flash Latest...");
      // Try gemini-1.5-flash-latest as a fallback
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error("Error generating LinkedIn post:", error);
    // Ultimate fallback to mock if everything fails, to prevent 500 errors
    return `Most ${topics[0] || 'tech'} products today are not just simple implementations anymore.\n\n${title} highlights a significant shift in how we approach systems.\n\nThis evolution is subtle, but important for our field.`;
  }
};
