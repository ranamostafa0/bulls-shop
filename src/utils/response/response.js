// export const asyncHandler = (fn) => {
//     return async (req, res, next) => {
//         await fn(req, res, next).catch(error => {
//             error.cause = 500;
//             return next(error)
//         })
//     }
// }

export const successResponse = ({ res, message = "success", status = 200, data = {} } = {}) => {
    return res.status(status).json({ message, data })
}


export const globalErrorHandling = (error, req, res, next) => {
    const statusCode = error.cause || error.status || 400;
    return res.status(statusCode).json({
        message: error.message,
        stack: process.env.MOOD == "DEV" ? error.stack : undefined
    })
}