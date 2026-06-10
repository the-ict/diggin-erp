import Joi from "joi";

const createWareTransactionValidator = Joi.object({
    wareItemId: Joi.string().required(),
    quantity: Joi.number().required().min(0),
    type: Joi.string().valid("INCOME", "OUTCOME").required(),
});

const updateWareTransactionValidator = Joi.object({
    wareItemId: Joi.string().optional(),
    quantity: Joi.number().optional().min(0),
    type: Joi.string().valid("INCOME", "OUTCOME").optional(),
}).min(1);

export {
    createWareTransactionValidator,
    updateWareTransactionValidator
}
