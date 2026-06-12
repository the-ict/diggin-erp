import Joi from "joi";

const createWorkerValidator = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    teamId: Joi.string().optional().allow(""),
    position: Joi.string().valid("DRIVER", "OPERATOR", "WORKER", "SUPERVISOR","MASTER").required(),
});

const updateWorkerValidator = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    teamId: Joi.string().optional().allow(""),
    position: Joi.string().valid("DRIVER", "OPERATOR", "WORKER", "SUPERVISOR", "MASTER").optional(),
}).min(1);

export {
    createWorkerValidator,
    updateWorkerValidator
};