import mongoose, {Schema} from "mongoose"


const productSchema: Schema = new mongoose.Schema({

    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    amount: {type: Number, required: true},
    images: [{type: String}],

}, {timestamps: true})

const Product = mongoose.model("product", productSchema)

// module.exports.User = User
export default Product