import express, { NextFunction, Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import mongoose from "mongoose";
import User from "../models/user.model";
import { authorized } from "../middlewares/auth.middleware";
import Order from "../models/order.model";

const router: express.Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const cartItems = await Cart.findOne({ user: (<any>req).user._id }).populate("items.product").lean();
  res.render("cart", { title: "Cart", cartItems });
});

router.post("/delete/:id",  async (req, res, next) => {
try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).render("404", { title: "Page not found" });
      }
      const user = (<any>req).user;
      const product = await Product.findOne({ _id: req.params.id });

      if(!product) {
        return res.status(400).render("404", { title: "Not found", message: "Product Not Found" });
      }
    
      const cart = await Cart.findOne({ user: user._id });
      if (!cart) {
        return res.status(404).render("404", { title: "Cart not found", message: "Cart not found" });
      }
      const cartItem = cart.items.find((i) => i.product.toString() == product._id.toString());
      const amount = cartItem ? cartItem.quantity : 0;
      const updatedCart  = await Cart.findOneAndUpdate(
        { user: user._id },
        {
          $pull: { items: { product: product._id } },
          $inc: { total_price: -(Number(product.price) * Number(amount)) },
        },
        {
          new: true,
        }
      );

      await Product.updateOne({_id: product._id}, {$inc: {amount: amount}})
      return res.status(200).redirect('/cart') 
} catch (error) {
    next(error)
}
});

router.post('/checkout', async (req, res, next) => {
    try {
    const user = (<any>req).user
    const userCart = await Cart.findOne({user: user._id})
    if(!userCart || !userCart.items.length) {
      return res.status(400).render("cart", { 
        title: "Cart", 
        cartItems: userCart, 
        errorMessage: "Your cart is empty. Add items before checking out."
      });
    }
    let cartItems =  userCart.items.map(item => ({product_id: item.product, quantity: item.quantity}))
    console.log(user);

    const newOrder = await Order.create({user: user._id, products: cartItems})
    await User.findOneAndUpdate({_id: user._id}, {$push: {orders: newOrder._id}})
    await Cart.findOneAndUpdate({user: user._id}, {items: [], total_price: 0})

    console.log(newOrder);
    
    res.redirect('/products')
    } catch (error) {
      next(error)
    }
    
})

export default router;
