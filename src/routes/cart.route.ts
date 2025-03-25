import express from "express";
import { checkout, deleteCart, getCart } from "../controllers/cart.controller";

const router: express.Router = express.Router();

router.get("/", getCart);
router.post("/delete/:id", deleteCart );
router.post('/checkout', checkout)

export default router;
