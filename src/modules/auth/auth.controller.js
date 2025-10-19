import { validation } from '../../middleware/validation.middleware.js';
import * as authService from './service/auth.service.js';
import * as validators from "./auth.validation.js"
import { Router } from 'express'
const router = Router();


router.post("/signup", validation(validators.signup), authService.signup)
router.post("/login", validation(validators.login), authService.login)

export default router