import mongoose from "mongoose"

export let categoryEnum = {
    Jackets: "Jackets",
    Hoodies: "Hoodies",
    Crewnecks: "Crewnecks",
    Pants: "Pants",
    Sweatpants: "Sweatpants",
    Slippers: "Slippers",
    Tracksuits: "Tracksuits",
    Pullover: "Pullover",
}



const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [2, "Name too short"],
        maxlength: [100, "Name too long"]
    },
    description: {
        type: String,
        trim: true,
        minlength: [10, "Description too short"]
    },

    category: {
        type: String,
        enum: {
            values: Object.values(categoryEnum),
            message: `category only allow ${Object.values(categoryEnum)}`
        },
        required: [true, "Category is required"]
    },

    originalPrice: {
        type: Number,
        required: true
    },

    discountPercent: {
        type: Number,
        required: false
    },

    finalPrice: {
        type: Number,
        required: true
    },

    variants: [
        {
            color: { type: String, required: true },
            size: { type: String, required: true },
            stock: { type: Number, required: true, min: 0 }
        }
    ],

    image: {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    },

    gallery: [
        {
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ],

    folderId: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // stock: {
    //     type: Number,
    //     required: true,
    //     default: 1
    // },

    // colors: {
    //     type: [String],
    //     required: false,
    //     default: []
    // },

    // size: {
    //     type: [String],
    //     default: []
    // },



}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})


export const productModel = mongoose.models.Product || mongoose.model("Product", productSchema)