import jwt from "jsonwebtoken";

export const signatureLevelEnum = { bearer: "Bearer", system: "System" }

export const generateToken = async ({
    payload = {},
    signature = process.env.USER_TOKEN_SIGNATURE,
    expiresIn = Number(process.env.TOKEN_EXPIRES_IN),
} = {}) => {
    return jwt.sign(payload, signature, { expiresIn });
};

export const verifyToken = async ({
    token = "",
    signature = process.env.USER_TOKEN_SIGNATURE,
} = {}) => {
    return jwt.verify(token, signature);
};


