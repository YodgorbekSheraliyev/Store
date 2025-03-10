import mongoose, { Schema } from "mongoose";

const cartSchema: Schema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: "user", required: true},
    items: [{
        product: {type: Schema.Types.ObjectId, ref: "product", required: true},
        quantity: {type: Number, required: true, min: 1}
    }],
    total_price: {type: Number, default: 0}

})

const Cart  = mongoose.model('cart', cartSchema)

export default Cart