import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { pool } from '../../lib/db'; 

// Gemini AI සම්බන්ධ කිරීම
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "API Key is missing. Please check your .env.local file." }, { status: 500 });
    }

    // 1. Database එකෙන් දැනට තියෙන කාර් ලැයිස්තුව ලබා ගැනීම
    const [cars] = await pool.query('SELECT name, category, price, seats, transmission, ac FROM cars');
    const carListString = JSON.stringify(Array.isArray(cars) ? cars : []);

    // 2. Gemini AI එකට උපදෙස් (System Prompt) ලබා දීම
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are a polite, helpful, and professional customer support assistant for 'Keystone Rentals', a premium car rental service in Sri Lanka.
      
      Here is the JSON list of currently available cars in our database: 
      ${carListString}

      User's Question: "${message}"

      Instructions:
      1. Answer the user's question based ONLY on the provided car list.
      2. If the user asks for a car or category we do not have, politely inform them and recommend the closest alternative from our list.
      3. Keep your answers concise, friendly, and formatted clearly (use bullet points if listing multiple cars).
      4. Always mention the price per day when recommending a car.
    `;

    // 3. Gemini ගෙන් පිළිතුර ලබා ගැනීම
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });

  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { reply: "I'm sorry, I am currently experiencing technical difficulties. Please try again in a moment." }, 
      { status: 500 }
    );
  }
}