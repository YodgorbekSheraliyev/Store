import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { engine } from "express-handlebars";
import { authorized, setLocals } from "./middlewares/auth.middleware";
import session from "express-session";
import MongoSession from 'connect-mongodb-session'
import flash from "connect-flash";
import path from "path";
import authRouter from './routes/auth.route'
import cartRouter from './routes/cart.route'
import productRouter from './routes/product.route'
import mongoose from "mongoose";


const app = express();
config();

const MongoStore = MongoSession(session)
const mongoStore = new MongoStore({
    uri: process.env.MONGO_URI,
    collection: "sessions"
})

//
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 60000 },
    store: mongoStore
  })
);
app.use(flash());
app.use(setLocals)

// Public folder
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");
app.engine("hbs", engine({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    helpers: {
      firstImage: function(images){
        return images[0]
      }
    }
  })
);
app.set("views", path.join(__dirname, "views"));
console.log(path.join(__dirname, "views"));


app.use('/', authRouter)
app.use('/', productRouter)
app.use('/', authorized, cartRouter)
app.get("/home", (req, res) => {
  const productError = req.flash('productError')
  res.render("home", {error: productError});
})


// app.get("/home", authorized, (req, res) => {
//   res.render("home");
// })

app.use('/*', (req, res) => {
  res.render('404', {title: "Page not found"})
})


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

  console.log(err.message);
  
  res.status(500).json({
    message: "Internal Server Error"
  })
  
})

const port: number | string = process.env.PORT || 3000;

const connectDB  = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {console.log("Connected to DB")})
  } catch (error) {
    console.log(error.message);
    
  }
}

connectDB()

app.listen(port, () => console.log(`http://localhost:${port}`));
