import express from "express"
import { getLoginPage, getRegisterPage, login, logout, register } from "../controllers/auth.controller"

const router:express.Router = express.Router()

router.get('/login', getLoginPage)
router.get('/register', getRegisterPage)

router.get('/logout', logout)

router.post('/register', register)
router.post("/login", login);


export default router