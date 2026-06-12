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
import wareTransactionRoutes from "./routers/waretransaction.routes.js";
import transactionRoutes from "./routers/transaction.routes.js";
import wareItemRoutes from "./routers/wareitem.routes.js";
import purchaseRoutes from "./routers/purchase.routes.js";
import machineRoutes from "./routers/machine.routes.js";
import workerRoutes from "./routers/worker.routes.js";
import wellRoutes from "./routers/well.routes.js";
import teamRoutes from "./routers/team.routes.js";
import userRoutes from "./routes/user.routes.js";

// initialize express
const app = express();

// middlewares
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));
app.use(cors({
    origin: ["http://localhost:5000", "http://localhost:3001"],
}));

// routes
app.get("/", (req: Request, res: Response) => {
    res.send("Working !");
});

app.use("/api/workers", workerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/wells", wellRoutes);
app.use("/api/ware-items", wareItemRoutes);
app.use("/api/ware-transactions", wareTransactionRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);

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