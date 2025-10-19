import joi from "joi";
import { genderEnum } from "../../DB/models/user.model.js";


const egyptPhoneRegex = /^(002|\+2)?01[0125][0-9]{8}$/;

export const updateBasicInfo = {
    body: joi.object({
        fullname: joi.string().min(2).max(50),
        phone: joi.string().pattern(egyptPhoneRegex)
            .message("Phone number must be a valid Egyptian number."),
        secondPhone: joi.string().pattern(egyptPhoneRegex)
            .message("Second phone number must be a valid Egyptian number."),
        gender: joi.string().valid(...Object.values(genderEnum)),
        address: joi.object({
            country: joi.string(),
            city: joi.string(),
            street: joi.string(),
            building: joi.string(),
            floorNumber: joi.string(),
            apartmentNumber: joi.string(),
            postalCode: joi.string(),
        })
    })
        .min(1) // must provide at least one field
        .required()
        .options({ allowUnknown: false })
};
