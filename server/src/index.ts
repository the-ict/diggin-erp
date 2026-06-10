import express from "express";
import type { NextFunction, Request, Response } from "express";
import connection_db from "./config/db.js";
import logger from "./utils/loggers.js";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// configure dotenv
dotenv.config();

// routes import
import workerRoutes from "./routers/worker.routes.js";

// initialize express
const app = express();

// middlewares
app.use(helmet());
app.use(morgan("combined"));
app.use(cors({
    origin: "http://localhost:5000",
}));

// routes
app.get("/", (req: Request, res: Response) => {
    res.send("Working !");
});

app.use("/api/workers", workerRoutes);

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const error_message = err.message || "Something went wrong";
    const error_cause = err.cause;
    res.status(500).json({
        message: error_message,
        cause: error_cause

    });
});

// start server
app.listen(3000, async () => {
    await connection_db();
    logger.info("Server is running on port 3000");
});