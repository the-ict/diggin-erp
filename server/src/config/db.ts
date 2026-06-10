import mongoose from "mongoose";
import logger from "../utils/loggers.js";

const connection_db = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        logger.info("mongodb connected successfully");
    } catch (error) {
        logger.error("mongodb connection error: ", error);
        process.exit(1);
    }
}

export default connection_db;
