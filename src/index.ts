import express, { Request, Response } from "express";
import { config } from "dotenv";
import { engine } from "express-handlebars";
import { authorized } from "./middlewares/auth.middleware";
import session from "express-session";
import MongoSession from 'connect-mongodb-session'
import flash from "connect-flash";
import path from "path";
import authRouter from './routes/auth.route'
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
app.use(express.urlencoded({ extended: true }));
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

// Public folder
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "hbs");
app.engine("hbs", engine({
    extname: "hbs",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
  })
);
app.set("views", path.join(__dirname, "views"));
console.log(path.join(__dirname, "views"));


app.use('/', authRouter)



app.get("/home", authorized, (req, res) => {
  res.render("home");
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
