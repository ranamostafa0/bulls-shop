import { Router } from 'express'
import { cloudFileUpload, fileValidation } from '../../utils/multer/cloud.multer.js';
import { authentication, authorization } from '../../middleware/auth.middleware.js';
import { roleEnum } from '../../DB/models/user.model.js';
import { validation } from '../../middleware/validation.middleware.js';
import * as validators from "./product.validation.js"
import * as productService from "./service/product.service.js"
const router = Router();

// Upload main image (1) + multiple gallery images
const upload = cloudFileUpload({ validation: fileValidation.image });

router.post("/", authentication, authorization({ accessRoles: roleEnum.admin }),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "gallery", maxCount: 5 },
    ]),
    validation(validators.createProduct),
    productService.createProduct
);

router.get("/", validation(validators.getAllProducts), productService.getAllProducts)
router.get("/:id", validation(validators.getSpecificProduct), productService.getSpecificProduct);


export default router


