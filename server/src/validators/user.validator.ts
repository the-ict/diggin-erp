import Joi from "joi";

const registerValidator = Joi.object({
    username: Joi.string().required().trim(),
    password: Joi.string().required(),
    role: Joi.string().valid("ADMIN", "MANAGER", "WORKER", "WAREHOUSEMAN").required().default("WORKER"),
    teamId: Joi.string().optional().allow(""),
});

export {
    registerValidator
}