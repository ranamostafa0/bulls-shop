import { successResponse } from "../../../utils/response/response.js";
import { calculateFinalPrice } from "../../../utils/common/finalPrice.js";
import { uploadFile, uploadFiles } from "../../../utils/multer/cloudinary.js";
import { productModel } from "../../../DB/models/product.model.js";
import * as dbService from "../../../DB/db.service.js"

export const createProduct = async (req, res) => {
    const user = req.user;
    const { name, description, category, originalPrice, discountPercent, variants } = req.body;
    const files = req.files;

    // Generate a unique folder ID for Cloudinary
    const folderId = String(Math.floor(Math.random() * (999999 - 100000 + 1) + 100000));
    const basePath = `category/${category}/product/${folderId}`;

    //Upload main image (required)
    if (!files?.image?.[0]) {
        return res.status(400).json({ message: "Main image is required" });
    }

    const mainImage = await uploadFile({
        file: files.image[0],
        path: basePath,
    });

    //Upload gallery images (optional)
    let gallery = [];
    if (files?.gallery?.length) {
        gallery = await uploadFiles({
            files: files.gallery,
            path: `${basePath}/gallery`,
        });
    }

    // Calculate final price
    const finalPrice = calculateFinalPrice(originalPrice, discountPercent);

    //Parse variants (validated JSON string from Joi)
    const parsedVariants = JSON.parse(variants);

    const product = await dbService.create({
        model: productModel,
        data: {
            name,
            description,
            category,
            originalPrice,
            discountPercent,
            finalPrice,
            variants: parsedVariants,
            image: {
                secure_url: mainImage.secure_url,
                public_id: mainImage.public_id,
            },
            gallery,
            folderId,
            createdBy: user._id,
        }
    })

    return successResponse({ res, status: 201 })

};



export const getAllProducts = async (req, res) => {
    const { name, category, minPrice, maxPrice, sortKey = "createdAt", sortOrder = "desc", page = 1, limit = 10 } = req.body
    let filter = {}

    // Search by name (case-insensitive)
    if (name) {
        filter.name = { $regex: name, $options: "i" }
    }

    //  Search by category
    if (category) {
        filter.category = category
    }

    //Price range filter
    if (minPrice || maxPrice) {
        filter.finalPrice = {
            ...(minPrice ? { $gte: Number(minPrice) } : {}),
            ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
        };
    }

    const skip = (Number(page) - 1) * Number(limit);

    //Sorting — dynamic key using []
    const sort = { [sortKey]: sortOrder === "desc" ? -1 : 1 };

    let products = await dbService.findAll({
        model: productModel,
        filter,
        sort,
        skip,
        limit: Number(limit),
    });

    const totalProducts = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return successResponse({
        res, data: {
            pagination: {
                totalProducts,
                totalPages,
                currentPage: Number(page),
                limit: Number(limit),
            },
            products
        }
    })
}


export const getSpecificProduct = async (req, res) => {
    const { id } = req.params

    const product = await dbService.findById({
        model: productModel,
        id,
        populate: [{ path: "createdBy", select: "firstName lastName fullname email" }]
    })

    if (!product) {
        throw new Error("Post not found", { cause: 404 })
    }

    return successResponse({ res, data: { product } })

}
