import { NextFunction, Request, Response } from "express";
import {verifyToken } from "../utils/jwt";
import User from "../models/user.model";

export const authorized = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1] || req.session?.token;

    if (!token) {
      res.status(401).redirect('/auth/login') 
      return
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(403).json({ message: "Invalid token" });
      return
    }
    const user  = await User.findOne({email: (<any>decoded).email}).select(['_id', 'email', 'phone'])
    req.user = user;
    
    next(); 
  } catch (error) {
    next(error);
  }
};

// export const authorized = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     (req as any).user = {
//       _id:"67d93efb68c5ed45ac9f853f",
//       email: 'yodgorbeksheraliyev777@gmail.com',
//       password: '1',
//       iat: 1742814749
//     };
//     console.log((<any>req).user);
    
//     next(); 
//   } catch (error) {
//     next(error);
//   }
// };

export const setLocals = (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.session.token
  
  next()
}