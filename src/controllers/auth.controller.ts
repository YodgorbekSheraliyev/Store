import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { generateToken } from "../utils/jwt";
import bcrypt from "bcryptjs";

const getLoginPage = (req: Request, res: Response) => {
  const errors = req.flash("loginError");
  res.render("login", { title: "Login", errors, hideFooter: true });
};

const getRegisterPage = (req: Request, res: Response) => {
  const errors = req.flash("registerError");
  res.render("register", { title: "Register", errors, hideFooter: true });
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/auth/login");
  });
};

const register = async (req: Request, res: Response) => {
  const missingField = Object.values(req.body).some(
    (field) => Boolean(field) == false
  );
  if (missingField) {
    req.flash("registerError", "Please fill all fields");
    return res.redirect("/auth/register");
  }

  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    req.flash("registerError", "This user already exist");
    return res.redirect("/auth/register");
  }

  if (req.body.password != req.body.password2) {
    req.flash("registerError", "Password doesn't match");
    return res.redirect("/auth/register");
  }

  const userData: Partial<IUser> = {
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    password: await bcrypt.hash(req.body.password, 10),
  };
  const user = await User.create(userData);

  const token = generateToken({ _id: user._id.toString(), email: user.email });
  req.session.token = token;
  req.headers.authorization = `Bearer ${token}`;
  res.redirect("/products");
};

const login = async (req: Request, res: Response) => {
  const missingField = Object.values(req.body).some(
    (field) => Boolean(field) == false
  );
  if (missingField) {
    req.flash("loginError", "Please fill all fields");
    return res.redirect("/auth/login");
  }
  const userExist = await User.findOne({ email: req.body.email });

  if (!userExist) {
    req.flash("loginError", "This user has not registered yet");
    return res.redirect("/auth/login");
  }
  const matchPassword = await bcrypt.compare(
    req.body.password,
    userExist.password
  );
  if (!matchPassword) {
    req.flash("loginError", "Invalid credentials");
    return res.redirect("/auth/login");
  }
  const token = generateToken({
    _id: userExist._id.toString(),
    email: userExist.email,
  });
  req.session.token = token;
  req.headers.authorization = `Bearer ${token}`;
  res.redirect("/products");
};
export { getRegisterPage, getLoginPage, logout, register, login };
