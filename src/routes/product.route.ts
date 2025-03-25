import express from "express";
import { authorized } from "../middlewares/auth.middleware";
import { addProduct, buyProduct, deleteProduct, getAllProducts, getProductById } from "../controllers/product.controller";

const router: express.Router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/buy/:id", authorized, buyProduct);

router.post('/delete/:id', authorized, deleteProduct)

router.post("/add", authorized, addProduct);

export default router;
