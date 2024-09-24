import { GoogleGenerativeAI } from "@google/generative-ai";
import { Context } from "hono";

export async function generateDescription(c: Context, content: string) {
  try {
    const genAI = new GoogleGenerativeAI(c.env.GEMINI_API);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `CONSIDER THE CONTEXT BELOW AND GENERATE A 20 WORD DESCRIPTION FOR IT. ${content}`;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}
