import mongoose from "mongoose";

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to DB");
      });
    } catch (error) {
      console.log(error.message);
    }
  };

export default connectDB
  