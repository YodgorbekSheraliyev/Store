import mongoose, { Schema, Document, Model } from "mongoose";

enum ORDER_STATUS {
    PENDING="PENDING",
    CANCELLED="CANCELLED",
    DELIVERED='DELIVERED',
}
interface IOrder {
    user: string
    products: {product_id: string, quantity: Number, status: ORDER_STATUS}[]
}

const orderSchema: Schema = new mongoose.Schema({
    user: {type: Schema.Types.ObjectId, ref: "user", required: true},
    products: [{
        product_id: {type: Schema.Types.ObjectId, ref: 'product', required: true},
        quantity: {type: Number, default: 1},
        status: {type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PENDING},
        }]
}, {timestamps: true, versionKey: false})

const Order: Model<IOrder>  = mongoose.model<IOrder>('order', orderSchema)

export default Order