import joi from "joi";
import { categoryEnum } from "../../DB/models/product.model.js";
import { validateVariants } from "../../utils/common/variants.js";
import mongoose from "mongoose";

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

export const getAllProducts = {
    body: joi.object({
        name: joi.string().min(2).max(100).optional(),
        category: joi.string().valid(...Object.values(categoryEnum)).optional(),

        minPrice: joi.number().positive().optional(),
        maxPrice: joi.number().positive().optional(),

        sortKey: joi.string().valid("name", "finalPrice", "originalPrice", "createdAt").default("createdAt"),
        sortOrder: joi.string().valid("asc", "desc").default("desc"),

        page: joi.number().integer().min(1).default(1),
        limit: joi.number().integer().min(1).max(50).default(10)
    }),
};


export const getSpecificProduct = {
    params: joi.object({
        id: joi.string()
            .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value)) {
                    return helpers.error("any.invalid");
                }
                return value;
            })
            .required()
            .messages({
                "any.required": "Product ID is required",
                "any.invalid": "Invalid Product ID format",
            }),
    }),
};
