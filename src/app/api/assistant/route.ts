import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { GoogleGenAI } from '@google/genai'

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'MISSING_API_KEY'
})

const RED_FLAGS = [
  'chest pain', 'heart attack', 'stroke', 'trouble breathing', 'breathless',
  'severe bleeding', 'unconscious', 'passed out', 'suicide', 'kill myself', 
  'self-harm', 'choking', 'seizure', 'paralysis'
]

export async function POST(req: Request) {
  console.log("Checking API Key inside route.ts POST:", process.env.GEMINI_API_KEY ? "EXISTS" : "UNDEFINED", "Actual value:", process.env.GEMINI_API_KEY);
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { concern } = await req.json()

    if (!concern || typeof concern !== 'string') {
      return NextResponse.json({ error: 'Please provide a health concern.' }, { status: 400 })
    }

    // 1. Rule-based red-flag check
    const concernLower = concern.toLowerCase()
    const hasRedFlag = RED_FLAGS.some(flag => concernLower.includes(flag))

    if (hasRedFlag) {
      return NextResponse.json({
        is_emergency: true,
        urgency: 'emergency',
        plain_language_summary: 'Your symptoms match potential emergency conditions. Please seek immediate emergency medical care or call your national emergency number.',
        recommended_specialization: 'Emergency Medicine',
        possible_conditions: ['Medical Emergency'],
        follow_up_questions: []
      })
    }

    // 2. Call AI for structured JSON analysis
    
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MISSING_API_KEY') {
        console.log("Fallback: GEMINI_API_KEY is missing, returning mock AI response.")
        return NextResponse.json({
          is_emergency: false,
          urgency: 'routine',
          plain_language_summary: 'Patient reports: ' + concern + '. (Mock Summary: API key not configured on server)',
          recommended_departments: ['General Medicine'],
          recommended_specialties: ['General Practitioner'],
          patient_instructions: 'Please rest and drink plenty of fluids. This is a mock response until the API key is configured.'
        })
      }
, { status: 500 })
    }

    const prompt = `
      You are a preliminary healthcare triage assistant.
      The patient says: "${concern}"
      
      Return a JSON object with:
      - possible_conditions (array of strings, e.g. ["Viral Pharyngitis", "Allergic Rhinitis"])
      - urgency (string, exactly one of: "routine", "soon", "urgent")
      - recommended_specialization (string, e.g. "General Physician", "Cardiologist", "Dermatologist")
      - follow_up_questions (array of 1-3 short strings asking for clarification, e.g. ["Do you have a fever?"])
      - plain_language_summary (string, a short compassionate summary. NEVER diagnose. Use words like "could be related to" or "possible conditions to discuss with a doctor".)

      Do NOT prescribe medication or dosage.
    `

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: "object",
          properties: {
            possible_conditions: { type: "array", items: { type: "string" } },
            urgency: { type: "string", enum: ["routine", "soon", "urgent"] },
            recommended_specialization: { type: "string" },
            follow_up_questions: { type: "array", items: { type: "string" } },
            plain_language_summary: { type: "string" }
          },
          required: ["possible_conditions", "urgency", "recommended_specialization", "follow_up_questions", "plain_language_summary"]
        }
      }
    })

    if (!response.text) {
      throw new Error("AI returned empty response")
    }

    const result = JSON.parse(response.text)
    
    return NextResponse.json({
      is_emergency: false,
      ...result
    })

  } catch (error: any) {
    console.error("AI Assistant Error:", error)
    return NextResponse.json({ error: 'Failed to analyze concern. Please try again.' }, { status: 500 })
  }
}
