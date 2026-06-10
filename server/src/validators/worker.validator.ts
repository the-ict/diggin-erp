import Joi from "joi";

const createWorkerValidator = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    teamId: Joi.string().required(),
});

const updateWorkerValidator = Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    teamId: Joi.string().optional(),
}).min(1);

export {
    createWorkerValidator,
    updateWorkerValidator
}
