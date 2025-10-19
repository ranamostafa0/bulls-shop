import * as DBService from "../../../DB/db.service.js"
import { roleEnum, userModel } from "../../../DB/models/user.model.js"
import { successResponse } from "../../../utils/response/response.js"
import { compareHash, generateHash } from "../../../utils/security/hash.security.js"
import { generateToken } from "../../../utils/security/token.security.js"

export const signup = async (req, res, next) => {
    const { fullname, email, password, phone } = req.body
    const checkUser = await DBService.findOne({
        model: userModel,
        filter: { email }
    })
    if (checkUser) {
        return next(new Error("Email already exists", { cause: 409 }))
    }
    const hashPassword = await generateHash({ plaintext: password })
    const user = await DBService.create({
        model: userModel,
        data: {
            fullname,
            email,
            password: hashPassword,
            phone,
        }
    })
    return successResponse({ res, status: 201 })
}


export const login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await DBService.findOne({
        model: userModel,
        filter: { email }
    })
    if (!user) {
        throw new Error("Invalid email or password", { cause: 401 });
    }

    const isMatch = await compareHash({ plaintext: password, hashValue: user.password })
    if (!isMatch) {
        throw new Error("Invalid email or password", { cause: 401 });
    }

    const signature = user.role == roleEnum.admin ? process.env.SYSTEM_TOKEN_SIGNATURE : process.env.USER_TOKEN_SIGNATURE
    const token = await generateToken({
        payload: { _id: user._id, role: user.role },
        signature
    })

    return successResponse({ res, data: { token, role: user.role } })

}

