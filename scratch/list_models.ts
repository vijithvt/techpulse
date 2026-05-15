import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: '../backend/.env' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function listModels() {
  try {
    console.log("Checking API Key:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");
    // The SDK doesn't have a direct listModels, but we can try to probe
    // Actually, we can use the fetch API to hit the endpoint directly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    console.log("Available Models:");
    if (data.models) {
      data.models.forEach((m: any) => {
        console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(", ")})`);
      });
    } else {
      console.log("No models returned. Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
