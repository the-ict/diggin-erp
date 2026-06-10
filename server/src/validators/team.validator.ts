import Joi from "joi";

const createTeamValidator = Joi.object({
    name: Joi.string().required().trim(),
    workersIds: Joi.array().items(Joi.string()).optional(),
});

const updateTeamValidator = Joi.object({
    name: Joi.string().trim().optional(),
    workersIds: Joi.array().items(Joi.string()).optional(),
}).min(1);

export {
    createTeamValidator,
    updateTeamValidator
}
