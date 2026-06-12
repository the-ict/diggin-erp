import Joi from "joi";

const createTransactionValidator = Joi.object({
    amount: Joi.number().required().min(0),
    currency: Joi.string().valid("UZS", "USD").required(),
    type: Joi.string().valid("INCOME", "OUTCOME").required(),
    note: Joi.string().optional(),
});

const updateTransactionValidator = Joi.object({
    amount: Joi.number().optional().min(0),
    currency: Joi.string().valid("UZS", "USD").optional(),
    type: Joi.string().valid("INCOME", "OUTCOME").optional(),
    note: Joi.string().optional(),
}).min(1);

export {
    createTransactionValidator,
    updateTransactionValidator
}
