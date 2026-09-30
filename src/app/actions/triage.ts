'use server'

import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini API client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
});

export async function triageSymptoms(
  symptoms: string, 
  availableDepartments: { id: string, name: string }[]
): Promise<{ departmentId: string, reason: string }> {
  
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API Key is missing. Please add it to Vercel.');
  }

  try {
    const prompt = `
    You are a medical triage assistant for a clinic. 
    A patient has described the following symptoms:
    "${symptoms}"

    Based on these symptoms, which of the following departments is the most appropriate for them to visit?
    ${availableDepartments.map(d => `- ${d.name} (ID: ${d.id})`).join('\n')}

    Please return a valid JSON object with EXACTLY two fields:
    "departmentId": "The ID of the chosen department"
    "reason": "A short, empathetic 1-sentence explanation of why this department is appropriate."

    Only output the JSON object, nothing else.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text();
    if (!text) throw new Error("Empty response from AI");

    const result = JSON.parse(text);
    
    // Fallback if AI picked an invalid department
    if (!availableDepartments.find(d => d.id === result.departmentId)) {
        return {
            departmentId: availableDepartments[0]?.id || "",
            reason: "We're not quite sure, but a General Practice doctor is a great place to start."
        }
    }

    return result;
  } catch (error: any) {
    console.error("AI Triage Error:", error);
    throw new Error("Could not process triage request. Please select a department manually.");
  }
}
