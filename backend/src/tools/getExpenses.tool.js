import Expense from "../models/Expense.js";
import { getCache, setCache } from "../services/redis.service.js";
import { recentExpensesKey } from "../services/cacheKeys.js";

const getExpenses = async (args)=>{
    const  limit = 5;


    // fatching cached data

    const key = recentExpensesKey(limit);

    const cachedData = await getCache(key);
    
    if(cachedData){
        return JSON.parse(cachedData)
    }


    // fatching db data

    const expenses = await Expense.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean() 
        
    const result =  {
        success: true,
        count: expenses.length,
        expenses
    };

    await setCache(key, result, 300);

    return result;
}

export default getExpenses;