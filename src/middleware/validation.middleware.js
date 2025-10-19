export const validation = (schema) => {
    return async (req, res, next) => {
        const validationError = []
        for (const key of Object.keys(schema)) {
            const validationResult = schema[key].validate(req[key], { abortEarly: false })
            if (validationResult.error) {
                validationError.push({ key, details: validationResult.error.details })
            }

        }
        if (validationError.length) {
            return res.status(400).json({ error_message: "valideation error", validationError })
        }
        return next()
    }
}