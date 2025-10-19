import multer from "multer";

export const fileValidation = {
    image: ['image/jpeg', 'image/jpg', 'image/png'],
    document: ['application/pdf']
}

export const cloudFileUpload = ({ validation = [] } = {}) => {
    const storage = multer.diskStorage({})

    function fileFilter(req, file, callback) {
        if (validation.includes(file.mimetype)) {
            callback(null, true);
        } else {
            const err = new Error("Invalid file format");
            callback(err, false);
        }
    }
    return multer({ fileFilter, storage })
}

