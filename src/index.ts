import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import { engine } from "express-handlebars";
import { authorized, setLocals } from "./middlewares/auth.middleware";
import session from "express-session";
import MongoSession from "connect-mongodb-session";
import flash from "connect-flash";
import path from "path";
import authRouter from "./routes/auth.route";
import cartRouter from "./routes/cart.route";
import productRouter from "./routes/product.route";
import connectDB from "./db";
import  setupView  from "./utils/view-engine.config";

const app = express();
config();

const MongoStore = MongoSession(session);
const mongoStore = new MongoStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 100 * 60 * 60 * 24 * 15 },
    store: mongoStore,
  })
);
app.use(flash());
app.use(setLocals);

// Public folder
app.use(express.static(path.join(__dirname, "public")));

// View Engine Config
setupView(app, engine)


app.get("/", (req, res) => {
  res.redirect("/products");
});
app.get('/contact', (req, res) => {
  res.render('contact', {title: "Contact Us"})
})

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    req.session.message = { type: "error", text: "All fields are required!" };
    return res.redirect("/contact");
  }

  // Simulating form processing
  req.session.message = { type: "success", text: "Message sent successfully!" };
  res.redirect("/contact");
});
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", authorized, cartRouter);

app.use("/*", (req, res) => {
  res.render("404", { title: "Page not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    message: err.message,
  });
});

const port: number | string = process.env.PORT || 3000;


connectDB();

app.listen(port, () => console.log(`http://localhost:${port}`));
