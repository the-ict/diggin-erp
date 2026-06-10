import Joi from "joi";

const createPurchaseValidator = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().required().min(0),
    price: Joi.number().required().min(0),
    note: Joi.string().optional(),
});

const updatePurchaseValidator = Joi.object({
    name: Joi.string().optional(),
    quantity: Joi.number().optional().min(0),
    price: Joi.number().optional().min(0),
    note: Joi.string().optional(),
}).min(1);

export {
    createPurchaseValidator,
    updatePurchaseValidator
}
