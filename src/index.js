import express from "express";
import { startAIListener } from "./services/aiListener.service.js";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./config/db.js";
import {app} from "./app.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
})

const PORT =  process.env.PORT || 3000;

connectDB()
.then(() =>{
    app.listen(PORT,"0.0.0.0", () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
    // startAIListener();
})
})
.catch((error) =>{
    console.log("server not started ")
})

app.get('/',(req,res) =>{
    res.send("<h1>Hello TechStalwarts</h1>");
});

