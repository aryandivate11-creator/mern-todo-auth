import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebase";

const AICopilot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const CHAT_ID = "global"; // 👈 global AI helper

  // 🔥 REAL-TIME LISTENER
  useEffect(() => {
    const q = query(
      collection(db, "aiChats", CHAT_ID, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, []);

  // ✍️ SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(
      collection(db, "aiChats", CHAT_ID, "messages"),
      {
        role: "user",
        text: input,
        createdAt: serverTimestamp()
      }
    );

    setInput("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">AI Copilot 🤖</h2>

      <div className="border p-4 h-80 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <b>{m.role}:</b> {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Ask something..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AICopilot;
