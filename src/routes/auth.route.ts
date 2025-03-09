import express, { Request, Response } from "express"
import { authorized } from "../middlewares/auth.middleware"

const router:express.Router = express.Router()

router.get('/', (req: Request, res: Response) => {
    
})

router.get('/login', (req: Request, res: Response) => {
    
})

export default router