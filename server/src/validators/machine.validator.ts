import Joi from "joi";

const createMachineValidator = Joi.object({
    number: Joi.string().required().trim(),
    teamId: Joi.string().optional().trim().allow(""),
    wells: Joi.array().items(Joi.string()).optional().allow(""),
    status: Joi.string().valid("ACTIVE", "REPAIRING").default("ACTIVE"),
});

const updateMachineValidator = Joi.object({
    number: Joi.string().trim().optional(),
    teamId: Joi.string().trim().optional().allow(""),
    wells: Joi.array().items(Joi.string()).optional().allow(""),
    status: Joi.string().valid("ACTIVE", "REPAIRING").optional(),
}).min(1);

export {
    createMachineValidator,
    updateMachineValidator
}
