import mongoose, {Schema, Document} from "mongoose"

export interface IUser extends Document {
    first_name: string
    last_name: string
    email: string
    phone: string
    password: string
    orders?: string[]
}

const userSchema: Schema = new mongoose.Schema({
    first_name: {type: String},
    last_name: {type: String},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
    orders: [{type: mongoose.SchemaTypes.ObjectId, ref: "order"}]

}, {timestamps: true})

const User = mongoose.model<IUser>("user", userSchema)

// module.exports.User = User
export default User