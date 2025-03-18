import express, { NextFunction, Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import mongoose from "mongoose";

const router: express.Router = express.Router();

router.get("/cart", async (req: Request, res: Response) => {
  const cartItems = await Cart.findOne({ user: (<any>req).user_id }).populate("items.product").lean();
  console.log(cartItems);
  res.render("cart", { title: "Cart", cartItems });
});

router.post("/cart/delete/:productId", async (req, res, next) => {
try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
        return res.status(400).render("404", { title: "Page not found" });
      }
      const user = (<any>req).user;
      const product = await Product.findOne({ _id: req.params.productId });

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
      console.log(updatedCart);
      
    
      return res.status(200).redirect('/cart') 
} catch (error) {
    next(error)
}
});

// router.post('/checkout', (req, res) => {

// })

export default router;
