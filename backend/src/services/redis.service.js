import {redisClient} from "../config/redis.js";

const getCache = async (key) =>{
    try {
        const data = await redisClient.get(key);
        if(data){
            console.log("CACHE HIT ", key)
            return data;
            console.log(data)
        }

        console.log("CACHE MISS ", key);
        return  null;
    } catch (error) {
        console.log(error.message)
    }
}

const setCache = async (key, data, ttl = 300) =>{
    try {
     await redisClient.set(
        key,
        JSON.stringify(data),
        {
            EX:ttl
        }
     );
        
    } catch (error) {
        console.log(error.message)
    }
}


const deleteCache = async (key) =>{
    try {
     await redisClient.del(key);
        
    } catch (error) {
        console.log(error.message)
    }
};


export {
    getCache,
    setCache,
    deleteCache
}