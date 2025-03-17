import express, { NextFunction, Request, Response } from "express"
import { authorized } from "../middlewares/auth.middleware"
import { generateToken } from "../utils/jwt"
import User, { IUser } from "../models/user.model"
import bcrypt from "bcryptjs"

const router:express.Router = express.Router()

router.get('/login', (req: Request, res: Response) => {
    const errors = req.flash("loginError");
    res.render("login", { title: "Login", errors , hideFooter: true});
})

router.get('/register', (req: Request, res: Response) => {
    const errors = req.flash("registerError")
    res.render('register', {title: "Register", errors,  hideFooter: true})
})

router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    }
    res.redirect('/login')
  })
})


router.post('/register', async (req: Request, res: Response) => {
    
  const missingField = Object.values(req.body).some((field) => Boolean(field) == false);
    if (missingField) {
      req.flash("registerError", "Please fill all fields");
      return res.redirect("/register");
    }

    const userExist = await User.findOne({email: req.body.email})
    if(userExist) {
      req.flash("registerError", "This user already exist")
      return res.redirect('/register')
    }
    
    if (req.body.password != req.body.password2){
      req.flash("registerError", "Password doesn't match")
      return res.redirect('/register')
    }
    
    const userData: Partial<IUser> = {
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: await bcrypt.hash(req.body.password, 10),
    }
    const user  = await User.create(userData)
    
    const token = generateToken({id: user._id.toString(), email: user.email, first_name: user.first_name, last_name: user.last_name})
    req.session.token = token
    req.headers.authorization = `Bearer ${token}`
    res.redirect("/home");

})

router.post("/login", async (req: Request, res: Response) => {
    const missingField = Object.values(req.body).some((field) => Boolean(field) == false);
    if (missingField) {
      req.flash("loginError", "Please fill all fields");
      return res.redirect("/login");
    }
    const userExist = await User.findOne({email: req.body.email})
    
    if(!userExist) {
        req.flash("loginError", "This user has not registered yet")
        return res.redirect("/login")
    }
    const matchPassword = await bcrypt.compare(req.body.password, userExist.password)
    if(!matchPassword) {
        req.flash("loginError", "Invalid credentials")
        return res.redirect("/login")
    }
    const token = generateToken(req.body)
    req.session.token = token
    req.headers.authorization = `Bearer ${token}`
    res.redirect("/home");
  });


export default router