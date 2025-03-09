import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export const authorized = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization?.split(" ")[1] || req.session?.token;

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(403).json({ message: "Invalid token" });
      return
    }

    (req as any).user = decoded;
    next(); // Move to next middleware
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};
