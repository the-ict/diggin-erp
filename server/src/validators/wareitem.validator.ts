import Joi from "joi";

const createWareItemValidator = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().required().min(0),
});

const updateWareItemValidator = Joi.object({
    name: Joi.string().optional(),
    quantity: Joi.number().optional().min(0),
}).min(1);

export {
    createWareItemValidator,
    updateWareItemValidator
}
