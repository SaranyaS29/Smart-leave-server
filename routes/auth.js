import express from 'express'
import {login,verify} from '../controllers/AuthController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js'

const router= express.Router()

router.post('/login',login)
router.get('/verify',AuthMiddleware,verify)
export default router;