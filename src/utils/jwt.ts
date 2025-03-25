import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()



const generateToken = (payload) => {
  return jwt.sign(payload, <string>process.env.JWT_SECRET);
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, <string>process.env.JWT_SECRET);
  } catch (error) {
    return new Error("Invalid token");
  }
};

const decodeToken = (token: string) => {
  try {
    return jwt.decode(token)
  } catch (error) {
    return new Error(error)
  }
}

export { generateToken, verifyToken, decodeToken}
