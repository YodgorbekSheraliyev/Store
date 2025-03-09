import { config } from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { engine } from "express-handlebars";
import { generateToken } from "./utils/jwt";
import { authorized } from "./middlewares/auth.middleware";
import session from "express-session";
import MongoSession from 'connect-mongodb-session'
import flash from "connect-flash";


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


app.get("/login", (req: Request, res: Response) => {
  const errors = req.flash("loginError");
  res.render("login", { errors , hideFooter: true});
});

app.post("/login", (req: any, res: any) => {
  const missingField = Object.values(req.body).some((field) => field == "");
  if (missingField) {
    req.flash("loginError", "Please fill all fields");
    return res.redirect("/login");
  }
  const token = generateToken(req.body)
  req.session.token = token
  req.headers.authorization = `Bearer ${token}`
  res.redirect("/home");
});

app.get("/home", authorized, (req, res) => {
  res.render("home");
})

const port: number | string = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port: ${port}`));
