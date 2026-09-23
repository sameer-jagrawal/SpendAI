import mongoose from "mongoose";
import {connect } from "mongoose"
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("DB connection failed")
        console.log(error.message)
    }
}


export default connectDB;