import express, { Request, Response } from "express";
import Product, { IProduct } from "../models/product.model";
import mongoose from "mongoose";
import { authorized } from "../middlewares/auth.middleware";
import Cart from "../models/cart.model";
import User from "../models/user.model";

const router: express.Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const products = await Product.find().lean();
  res.render("home", { products });
});

router.get("/:id", async (req: Request, res: Response) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).render("404", { title: "Product not found" });
  }

  const product = await Product.findOne({ _id: req.params.id }).lean();
  if (!product){
    return res.status(404).render("404", { title: "Product not found" });
  }
  res.render("product", { title: product.name, product });
});

router.post("/buy/:id", authorized, async (req: Request, res: Response) => {
  
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).render("404", { title: "Page not found" });
  }
  const user = (<any>req).user
  const {amount}: Partial<IProduct>  = req.body
  const product = await Product.findOneAndUpdate({ _id: req.params.id }, {$inc: {amount: -Number(amount)}}, {upsert: true, new: true}).lean();
  if (!product) {
    return res.render("/404", {title: "Not found"});
  }

  await Cart.findOneAndUpdate(
    {user: user._id},
    {
      $push: {items: {product: product._id, quantity: amount, total_price: Number(product.price) * Number(amount)}},
      $inc: {total_price: Number(product.price) * Number(amount)}
    }, {
      upsert: true,
      new: true
    }
   )

   
   return res.redirect('/products')

});

router.post('/delete/:id', authorized, async(req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).redirect('/products')
    }
    await Product.deleteOne({_id: req.params.id})
    res.redirect('/products')
  } catch (error) {
    next(error)
  }
})

router.post("/add", async (req, res) => {
  const { name, description, price, amount, image } = req.body;
  await Product.create({ ...req.body, images: image });

  res.status(201).json({ success: true });
});

export default router;
