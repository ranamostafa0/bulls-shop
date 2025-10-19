import bcrypt from "bcryptjs"
export const generateHash = async ({ plaintext = "", saltRound = process.env.SALT } = {}) => {
    return await bcrypt.hash(plaintext, parseInt(saltRound))
}

export const compareHash = async ({ plaintext = "", hashValue = "" } = {}) => {
    return await bcrypt.compare(plaintext, hashValue)
}