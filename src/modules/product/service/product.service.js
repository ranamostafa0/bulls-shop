import { successResponse } from "../../../utils/response/response.js";
import { calculateFinalPrice } from "../../../utils/common/finalPrice.js";
import { uploadFile, uploadFiles } from "../../../utils/multer/cloudinary.js";
import { productModel } from "../../../DB/models/product.model.js";

export const createProduct = async (req, res) => {
    const user = req.user;
    const { name, description, category, originalPrice, discountPercent, variants } = req.body;
    const files = req.files;
    console.log({files})

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
    // const discount = Number(discountPercent) || 0;
    // const price = Number(originalPrice);
    // const finalPrice = price - (price * discount) / 100;

    //Parse variants (validated JSON string from Joi)
    const parsedVariants = JSON.parse(variants);

    //Create product
    const product = await productModel.create({
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
    });

    return successResponse({ res, status: 201 })

};
