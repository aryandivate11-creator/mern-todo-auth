import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import importRoutes from "./routes/import.routes.js";
import exportRoutes from "./routes/export.routes.js";


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

app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return next();
  }
  express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',authRoutes);

app.use('/api/todos',todoRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/import", importRoutes);

app.use("/api/export", exportRoutes);

app.use("/uploads", express.static("uploads"));
