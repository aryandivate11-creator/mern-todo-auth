import { GoogleGenerativeAI } from "@google/generative-ai";
import { error } from "console";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const askGemini = async (userMessage) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest"
    });

    // ✅ ONE SINGLE PROMPT (this is the key fix)
    const prompt = `
You are an AI assistant inside a MERN Todo application.

App features:
- User authentication (JWT + refresh tokens)
- Create, edit, delete todos
- Import todos from Excel (.xlsx)
- Export todos to Excel
- Profile management (name, phone, avatar)

Rules:
- Answer clearly and briefly
- Be helpful and practical
- Assume the user is using THIS app

Your job is to help users:
- plan tasks
- prioritize todos
- stay productive
- give concise, actionable advice
Do not answer unrelated questions.

User message:
${userMessage}
`;

    const result = await model.generateContent(prompt);

    const response = result.response;
    const text = response.text();

    return text;

  } catch (err) {
    console.error("GEMINI ERROR:", err);
   if (error.status === 429) {
      return "⚠️ AI limit reached for today. Please try again later.";
    }

    return "⚠️ AI is temporarily unavailable.";
      }
};

// User question:
// ${userMessage}