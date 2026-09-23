import express from "express";
import cors from "cors";
import chatRoutes  from "../src/routes/chat.routes.js";
const app = express()

app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoutes)


app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "SpendAI server is running"
    });
  });

  
  export default app;