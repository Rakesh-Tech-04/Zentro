import Joi from "joi";

export const authSchema = Joi.object({
    name: Joi.string()
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
    .min(3)
    .required(),
    
})