import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

function validateApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing from environment variables.");
    throw new Error("Gemini API key is not configured. Please check your settings.");
  }
}

export async function generateOutreachDM(niche: string, serviceOffering: string) {
  validateApiKey();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a professional, high-converting cold outreach DM template for a beginner video editor.
      
Target Client Niche: ${niche}
My Service Offering: ${serviceOffering}

Requirements:
- Keep it under 280 characters if possible (for Twitter/Instagram).
- Reference the niche specifically.
- Include placeholders like [name], [recent_video_topic], and [My Name].
- Focus on how the service solves a specific problem for that niche.
- The tone should be friendly, professional, and value-first.
- Do not use hashtags.
- Output ONLY the template text.`,
    });

    if (!response.text) {
      throw new Error("Received empty response from Gemini API");
    }

    return response.text;
  } catch (error) {
    console.error(`[GeminiService] Error in generateOutreachDM for niche: ${niche}`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate outreach DM: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating outreach DM.");
  }
}

export async function generateClientPersona(niche: string) {
  validateApiKey();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a detailed Ideal Client Persona for a video editor targeting the ${niche} niche.
      
Include the following sections in a clean format:
1. Persona Name (Invent a catchy name for this type of client)
2. Likely Pain Points (List 3 specific problems they face regarding video)
3. Content Preferences (What style of videos do they want? Fast-paced? Cinematic? Informational?)
4. Typical Platforms (Where are they most active?)
5. How to Hook Them (The #1 strategy to get their attention)

Keep the tone professional and strategic. Output ONLY the persona information.`,
    });

    if (!response.text) {
      throw new Error("Received empty response from Gemini API");
    }

    return response.text;
  } catch (error) {
    console.error(`[GeminiService] Error in generateClientPersona for niche: ${niche}`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate client persona: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating client persona.");
  }
}

export async function generateObjectionResponse(objection: string, niche: string, serviceOffering: string) {
  validateApiKey();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a high-ticket sales closer for a video editing freelancer.
      
Common Objection: ${objection}
Target Client Niche: ${niche}
My Service Offering: ${serviceOffering}

Requirements:
- Provide a professional, empathetic, and persuasive response.
- Reframe the objection as an investment or opportunity.
- Focus on ROI and value.
- Keep it concise (under 280-400 characters).
- Include a clear, soft call to action.
- Output ONLY the response text.`,
    });

    if (!response.text) {
      throw new Error("Received empty response from Gemini API");
    }

    return response.text;
  } catch (error) {
    console.error(`[GeminiService] Error in generateObjectionResponse: "${objection}"`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to handle objection: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating objection response.");
  }
}

export async function generateContentIdeas(niche: string) {
  validateApiKey();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a viral content strategist and world-class video editor. Generate 10 creative video content ideas for a creator in the ${niche} niche.
      
 For each idea, provide:
 1. A catchy Title.
 2. A viral "Hook" (the first 3 seconds).
 3. The "Concept" (what happens in the video).
 4. "Editor's Wedge" (Specific editing techniques that would make this video pop, e.g., speed ramping, sound design, motion graphics).
 
 Requirements:
 - Target a mix of high-retention short-form and engaging long-form.
 - The ideas must be specifically tailored to the ${niche} niche.
 - The 'Editor's Wedge' should highlight why they NEED a professional editor for this specific idea.
 - Output ONLY the list of 10 ideas in a clear, numbered format.`,
    });

    if (!response.text) {
      throw new Error("Received empty response from Gemini API");
    }

    return response.text;
  } catch (error) {
    console.error(`[GeminiService] Error in generateContentIdeas for niche: ${niche}`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate content ideas: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating content ideas.");
  }
}

export async function generateFollowUpSequence(niche: string, prospectName: string) {
  validateApiKey();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 3-touch follow-up direct message sequence for a freelance video editor.
      
Target Prospect Name: ${prospectName}
Target Niche/Sector: ${niche}

Requirements for the 3 messages:

Message 1 (Day 1 - sent 24hrs after first DM):
- Goal: Friendly reminder + Add Value.
- Content: A specific tip or observation about ${prospectName}'s content/niche.
- Length: Short, 3-4 lines max.

Message 2 (Day 3 - sent 3 days after first DM):
- Goal: Soft Pitch + Benefit.
- Content: Mention one specific result (e.g. higher retention, more views) you can get them. Include a question to re-engage.
- Length: 4-5 lines max.

Message 3 (Day 7 - sent 7 days after first DM):
- Goal: Urgency/Breakup.
- Content: "Last message" tone, but open door for future.
- Length: 3-4 lines max.

Formatting: Output the response as a JSON array of objects with the following keys: "day" (number), "type" (string), "script" (string). 
Example: [{"day": 1, "type": "Day 1 Follow-up", "script": "..."}, ...]
Output ONLY valid JSON.`,
    });

    if (!response.text) {
      throw new Error("Received empty response from Gemini API");
    }

    // Try to validate if it's JSON to provide earlier failure if the AI missed the format
    try {
      JSON.parse(response.text);
    } catch (e) {
      console.warn("[GeminiService] Model returned non-JSON for follow-up sequence. Attempting to return raw text anyway.");
    }

    return response.text;
  } catch (error) {
    console.error(`[GeminiService] Error in generateFollowUpSequence for: ${prospectName}`, error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate follow-up sequence: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating follow-up sequence.");
  }
}
