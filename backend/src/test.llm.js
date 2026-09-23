import "dotenv/config"
import askLLM from "./services/llm.service.js"
import connectDB from "./config/db.js";

await connectDB()

const response = await askLLM( "Show me my recent expnses.");
console.log("\nFINAL RESPONSE:\n");

if (typeof response === "string") {
  console.log(response);
} else {
  console.log(response.output_text);
}