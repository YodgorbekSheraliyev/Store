import mongoose, {Schema, Document} from "mongoose"

interface IProduct extends Document {
    name: string
    description: string
    price: Number,
    amount: Number,
    images: string[],
}

const productSchema: Schema = new mongoose.Schema({

    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    amount: {type: Number, required: true},
    images: [{type: String}],

}, {timestamps: true})

const Product = mongoose.model<IProduct>("product", productSchema)


// module.exports.User = User
export default Product