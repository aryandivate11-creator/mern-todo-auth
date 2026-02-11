// import { askGemini } from "../services/gemini.service.js";
// import Todo from "../models/Todo.model.js";
// import User from "../models/User.model.js";

// export const chatWithAI = async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message || !message.trim()) {
//       return res.status(400).json({ message: "Message is required" });
//     }

//     // 1️⃣ Get user info
//     const user = await User.findById(req.user.id).select("name email");

//     // 2️⃣ Get todos
//     const todos = await Todo.find({ user: req.user.id });

//     const completed = todos.filter(t => t.completed).length;
//     const pending = todos.length - completed;

//     // 3️⃣ Build AI context
//     const context = `
// User Info:
// - Name: ${user?.name || "User"}
// - Email: ${user.email}

// Todo Stats:
// - Total Todos: ${todos.length}
// - Pending: ${pending}
// - Completed: ${completed}

// User Question:
// ${message}
// `;

//     // 4️⃣ Ask Gemini
//     const reply = await askGemini(context);

//     res.json({ reply });

//   } catch (error) {
//     console.error("AI CONTROLLER ERROR:", error);
//     res.status(500).json({ message: "AI failed to respond" });
//   }
// };

import { askGemini } from "../services/gemini.service.js";
import { firestore } from "../firebase/firebaseAdmin.js";

const CHAT_ID = "global";

export const chatWithAI = async (req, res) => {
  try {
        console.log("BODY:", req.body);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    // 1️⃣ Save user message
    await firestore
      .collection("aiChats")
      .doc(CHAT_ID)
      .collection("messages")
      .add({
        role: "user",
        text: message,
        createdAt: new Date()
      });

    // 2️⃣ Ask Gemini
    const reply = await askGemini(message);

    // 3️⃣ Save AI reply
    await firestore
      .collection("aiChats")
      .doc(CHAT_ID)
      .collection("messages")
      .add({
        role: "ai",
        text: reply,
        createdAt: new Date()
      });

    res.json({ reply });

  } catch (err) {
    console.error("AI CONTROLLER ERROR:", err);
    res.status(500).json({ message: "AI failed" });
  }
};
