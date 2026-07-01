import { authSchema } from "../utils/authJoi.js";
import { ExpressError } from "../utils/ExpressError.js";

export const authValidation = (req, res, next) => {
    let { error } = authSchema.validate(req.body, {
        abortEarly: false,
        allowUnknown: true
    })
    if (error) {
        let msg = error.details.map(e => e.message).join('\n')
        next(new ExpressError(400, msg))
    }
    next()

}
