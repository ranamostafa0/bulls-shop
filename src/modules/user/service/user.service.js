import { successResponse } from "../../../utils/response/response.js";
import * as DBService from "../../../DB/db.service.js"
import { userModel } from "../../../DB/models/user.model.js";
import { destroyFile, uploadFile } from "../../../utils/multer/cloudinary.js";


export const getProfile = async (req, res, next) => {
    if (!req.user)
        throw new Error("Unauthorized access — please log in", { cause: 401 });

    return successResponse({ res, data: { user: req.user } })
};

export const getAllUsers = async (req, res, next) => {
    const users = await DBService.findAll({
        model: userModel,
        select: "-password"
    })

    return successResponse({ res, data: { users } })
};

export const updateBasicInfo = async (req, res, next) => {
    if (!req.user?._id) {
        throw new Error("Unauthorized", { cause: 401 });

    }
    const updateData = { ...req.body };

    // Manually split fullname if provided
    if (updateData.fullname) {
        const [firstName, lastName] = updateData.fullname.split(" ");
        updateData.firstName = firstName;
        updateData.lastName = lastName;
    }

    if (updateData.address) {
        // Merge existing address with updated fields
        const currentUser = await DBService.findById({ model: userModel, id: req.user._id });
        updateData.address = { ...currentUser.address?.toObject(), ...updateData.address };
    }
    const user = await DBService.findByIdAndUpdate({
        model: userModel,
        id: req.user._id,
        data: updateData,
        options: {
            runValidators: true,
            new: true
        },
    });

    if (!user) {
        throw new Error("Invalid account", { cause: 400 });
    }
    return successResponse({
        res,
        message: "success",
        data: { user },
    });
}


export const profileImage = async (req, res, next) => {
    const { secure_url, public_id } = await uploadFile({ file: req.file, path: `user/${req.user._id}` })
    const user = await DBService.findOneAndUpdate({
        model: userModel,
        filter: {
            _id: req.user._id
        },
        data: {
            picture: { secure_url, public_id }
        },
        options: { new: false }
    })


    if (user?.picture?.public_id) {
        await destroyFile({ public_id: user.picture.public_id })
    }
    return successResponse({ res, data: { picture: { secure_url, public_id } } })
}
