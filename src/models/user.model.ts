import mongoose from "mongoose"

interface IUser  {
    first_name: string,
    last_name: string,
    email: string,
    verify_email_token: string,
    verify_email_token_time: string,
    phone: string,
    orders: string[]
}

const userSchema = new mongoose.Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String, required: true, unique: true},
    verify_email_token: {type: String},
    verify_email_token_time: {type: Date},
    phone: {type: String, required: true, unique: true},
    orders: [{type: mongoose.SchemaTypes.ObjectId, ref: "products"}]

}, {timestamps: true})

const User = mongoose.model<IUser>("user", userSchema)


// module.exports.User = User
export default User