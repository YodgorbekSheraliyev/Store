import mongoose, {Schema} from "mongoose"


const userSchema: Schema = new mongoose.Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String, required: true, unique: true},
    verify_email_token: {type: String},
    verify_email_token_time: {type: Number, default: 60*60*5},
    phone: {type: String, required: true, unique: true},
    orders: [{type: mongoose.SchemaTypes.ObjectId, ref: "product"}]

}, {timestamps: true})

const User = mongoose.model("user", userSchema)

// module.exports.User = User
export default User