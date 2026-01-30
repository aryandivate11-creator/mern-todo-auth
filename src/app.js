import express from "express";
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import importRoutes from "./routes/import.routes.js";
import cors from "cors";

export const app =  express();

app.use(
    cors({
         origin: [
         "http://localhost:5173",
         "https://mern-todo-auth-murex.vercel.app"
          ],
          methods: ["GET", "POST", "PUT", "DELETE"],
          credentials:true,
    })
)

app.use(express.json());

app.use('/api/auth',authRoutes);

app.use('/api/todos',todoRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/import", importRoutes);