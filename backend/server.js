import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import {connectRedis, redisClient} from "./src/config/redis.js"

const PORT = process.env.PORT || 5000;

await connectDB()
await connectRedis();

// await redisClient.set("spendai:test", "Hello redis");
// const value = await redisClient.get("spendai:test")
// console.log("Redis test value", value)


app.listen(PORT, ()=>{
    console.log(`server is running on ${PORT}`)
});

