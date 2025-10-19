import joi from "joi";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const egyptPhoneRegex = /^(002|\+2)?01[0125][0-9]{8}$/;

export const login = {
    body: joi.object().keys({
        email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['net', 'com'] } }).required(),
        password: joi.string().pattern(passwordRegex).required().messages({
            "string.pattern.base":
                "Password must be at least 8 characters, include one uppercase, one lowercase, and one digit.",
        }),
    }).required().options({ allowUnknown: false })

}

export const signup = {
    body: joi.object().keys({
        fullname: joi.string().min(2).max(50).required(),
        email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 3, tlds: { allow: ['net', 'com'] } }).required(),
        phone: joi.string().pattern(egyptPhoneRegex).required().messages({
            "string.pattern.base": "Phone number must be a valid Egyptian number.",
        }),
        password: joi.string().pattern(passwordRegex).required()
            .messages({
                "string.pattern.base":
                    "Password must be at least 8 characters, include one uppercase, one lowercase, and one digit.",
            }),
    }).required().options({ allowUnknown: false }),

    query: joi.object().keys({
        lang: joi.string().valid("en", "ar")
    })
}