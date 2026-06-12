import Joi from "joi";

const createWellValidator = Joi.object({
    team: Joi.string().required(),
    except_length: Joi.number().required().min(0),
    length: Joi.number().optional().min(0),
    status: Joi.string().valid("DUGGING", "FINISHED", "SUCCESSFUL", "FAILED").required(),
});

const updateWellValidator = Joi.object({
    team: Joi.string().optional(),
    length: Joi.number().optional().min(0),
    except_length: Joi.number().optional().min(0),
    status: Joi.string().valid("DUGGING", "FINISHED", "SUCCESSFUL", "FAILED").optional(),
}).min(1);

export {
    createWellValidator,
    updateWellValidator
}
