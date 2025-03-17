import express, { NextFunction, Request, Response } from "express"
import Cart from "../models/cart.model"

const router:express.Router = express.Router()

router.get('/cart', async (req: Request, res: Response) => {
    const items = await Cart.find()
    
    res.render('cart', {title: "Cart", cart: items})
})



export default router