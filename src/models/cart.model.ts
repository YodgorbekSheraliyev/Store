import mongoose, { Schema, Document } from "mongoose";

interface ICart {
    user: string
    items: {product: string, quantity: Number}[]
    total_price: Number
}

const cartSchema: Schema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: "user", required: true},
    items: [{
        product: {type: Schema.Types.ObjectId, ref: "product", required: true},
        quantity: {type: Number, required: true, min: 1}
    }],
    total_price: {type: Number, default: 0}

})

const Cart  = mongoose.model<ICart>('cart', cartSchema)

export default Cart