import mongoose, {Schema, Document} from "mongoose"

export interface IUser extends Document {
    first_name: string
    last_name: string
    email: string
    verify_email_token?: string
    verify_email_token_time?: Date
    phone: string
    password: string
    orders?: string[]
}

const userSchema: Schema = new mongoose.Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String, required: true, unique: true},
    verify_email_token: {type: String},
    verify_email_token_time: {type: Number, default: 60*60*5},
    phone: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    orders: [{type: mongoose.SchemaTypes.ObjectId, ref: "order"}]

}, {timestamps: true})

const User = mongoose.model<IUser>("user", userSchema)

// module.exports.User = User
export default User