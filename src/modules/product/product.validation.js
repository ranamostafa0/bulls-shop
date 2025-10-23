import joi from "joi";
import { categoryEnum } from "../../DB/models/product.model.js";
import { validateVariants } from "../../utils/common/variants.js";

export const createProduct = {
    body: joi.object({
        name: joi.string().min(2).max(100).required(),
        description: joi.string().min(10).optional(),
        category: joi.string().valid(...Object.values(categoryEnum)).required(),
        originalPrice: joi.number().positive().required(),
        discountPercent: joi.number().min(0).max(100).optional(),
        variants: joi.string().required().custom(validateVariants),
    })
}
