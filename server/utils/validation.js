import {checkSchema, validationResult} from "express-validator";


export const extendedCheckSchema = (schema) => {
    const checkErrors = (request, response, next) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }

        next()
    }
    return [checkSchema(schema), checkErrors]
}