import { signatureLevelEnum, verifyToken } from "../utils/security/token.security.js";
import * as DBService from "../DB/db.service.js"
import { roleEnum, userModel } from "../DB/models/user.model.js";


export const authentication = async (req, res, next) => {
    const { authorization } = req.headers;

    //No token → treat as guest (req.user stays undefined)
    if (!authorization) return next();

    const [prefix, token] = authorization.split(" ");

    //Invalid header format
    if (!token || !Object.values(signatureLevelEnum).includes(prefix))
        throw new Error("Invalid authorization format", { cause: 400 });

    // Choose signature based on prefix
    const signature =
        prefix === signatureLevelEnum.system
            ? process.env.SYSTEM_TOKEN_SIGNATURE
            : process.env.USER_TOKEN_SIGNATURE;

    // Verify token
    const decoded = await verifyToken({ token, signature });
    if (!decoded?._id) throw new Error("Invalid token payload", { cause: 400 });

    // Fetch user
    const user = await DBService.findById({
        model: userModel,
        id: decoded._id,
    });
    if (!user) throw new Error("User not found", { cause: 404 });

    // Validate role matches prefix
    if (user?.role === roleEnum.admin && prefix !== signatureLevelEnum.system)
        throw new Error("Admins must use system tokens", { cause: 403 });

    if (user?.role === roleEnum.user && prefix !== signatureLevelEnum.bearer)
        throw new Error("Users must use bearer tokens", { cause: 403 });

    //Attach authenticated user
    req.user = user;
    return next();
};


export const authorization = ({ accessRoles = [] } = {}) => {
    return async (req, res, next) => {
        console.log({ accessRoles, currentRole: req.user.role, match: accessRoles.includes(req.user.role) })
        if (!accessRoles.includes(req.user.role)) {
            return next(new Error("You are not authorized", { cause: 401 }))
        }
        return next()
    }

}