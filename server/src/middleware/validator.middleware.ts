import type {
    NextFunction,
    Request,
    Response
} from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({ error: "Request body is required" });
            return;
        }
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            res.status(400).json({ error: error.details[0]?.message });
            return;
        }
        next();
    };
};