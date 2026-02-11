// import { firestore } from "../firebase/firebaseAdmin.js";
// import { askGemini } from "./gemini.service.js";

// const CHAT_ID = "global";
import { firestore } from "../firebase/firebaseAdmin.js";

export const startAIListener = () => {
  console.log("🤖 AI Listener started (GLOBAL)");

  let isInitialLoad = true;
  const CHAT_ID = "global";
  
  firestore
    .collection("aiChats")
    .doc(CHAT_ID)
    .collection("messages")
    .orderBy("createdAt")
    .onSnapshot(async (snapshot) => {

      if (isInitialLoad) {
        isInitialLoad = false;
        return; // 🔥 Ignore existing messages
      }
       
      const changes = snapshot.docChanges();
      console.log("Changes:", changes.length);

      for (const change of changes) {
        if (change.type !== "added") continue;

        const message = change.doc.data();

        if (message.role !== "user") continue;

        console.log("🧠 User asked:", message.text);

        const reply = await askGemini(message.text);

        await firestore
          .collection("aiChats")
          .doc(CHAT_ID)
          .collection("messages")
          .add({
            role: "ai",
            text: reply,
            createdAt: new Date()
          });
      }
    });
};


// .onSnapshot(async (snapshot) => {
//   console.log("Snapshot triggered");

//   const changes = snapshot.docChanges();
//   console.log("Changes:", changes.length);