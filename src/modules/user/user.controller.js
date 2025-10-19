import { roleEnum } from '../../DB/models/user.model.js';
import { authentication, authorization } from '../../middleware/auth.middleware.js';
import { validation } from '../../middleware/validation.middleware.js';
import { cloudFileUpload, fileValidation } from '../../utils/multer/cloud.multer.js';
import * as userService from './service/user.service.js';
import * as validators from "./user.validation.js"
import { Router } from 'express'
const router = Router();

router.get("/", authentication, authorization({ accessRoles: roleEnum.admin }), userService.getAllUsers)
router.get("/get-profile", authentication, userService.getProfile)

router.patch("/", authentication, validation(validators.updateBasicInfo), userService.updateBasicInfo)
router.patch("/profile-image", authentication, cloudFileUpload({ validation: fileValidation.image }).single("image"), userService.profileImage)

export default router