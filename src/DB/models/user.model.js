import mongoose from "mongoose"

export let genderEnum = {
    male: "male",
    female: "female"
}

export let roleEnum = {
    admin: "admin",
    user: "user"
}

const addressSchema = new mongoose.Schema({
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    building: { type: String, required: true, trim: true },
    floorNumber: { type: String, trim: true },
    apartmentNumber: { type: String, trim: true },
    postalCode: { type: String, trim: true },
});


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: {
            values: Object.values(genderEnum),
            message: `gender only allow ${Object.values(genderEnum)}`
        },
        default: genderEnum.male
    },
    role: {
        type: String,
        enum: {
            values: Object.values(roleEnum),
            message: `role only allow ${Object.values(roleEnum)}`
        },
        default: roleEnum.user
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    secondPhone: {
        type: String,
        trim: true,
    },
    address: addressSchema,

    picture: {
        secure_url: String,
        public_id: String
    }

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

userSchema.virtual("fullname").set(
    function (value) {
        const [firstName, lastName] = value?.split(" ") || []
        this.set({ firstName, lastName })
    }).get(
        function () {
            return this.firstName + " " + this.lastName
        }
    )

export const userModel = mongoose.models.User || mongoose.model("User", userSchema)