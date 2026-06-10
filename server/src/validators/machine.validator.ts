import Joi from "joi";

const createMachineValidator = Joi.object({
    number: Joi.string().required().trim(),
    teamId: Joi.string().required().trim(),
    wells: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid("ACTIVE", "REPAIRING").default("ACTIVE"),
});

const updateMachineValidator = Joi.object({
    number: Joi.string().trim().optional(),
    teamId: Joi.string().trim().optional(),
    wells: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid("ACTIVE", "REPAIRING").optional(),
}).min(1);

export {
    createMachineValidator,
    updateMachineValidator
}
