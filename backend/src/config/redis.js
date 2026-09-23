import {createClient} from "redis";

const redisClient  = createClient({
    url : process.env.REDIS_URL
});


redisClient.on("error",(error)=>{
    console.log("Redis Error :", error)
})

const connectRedis = async() =>{
    try {
        await redisClient.connect();
        console.log("redis connected successfully")
    } catch (error) {
        console.log("redis connection failed ", error.message);
        process.exit(1)
    }
}

export {redisClient, connectRedis};