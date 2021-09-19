const express = require("express");
const expressSession = require("express-session");
const cors = require("express-cors");
const passport = require("passport");
const path = require("path");
const logger = require("morgan");
const db = require("./db/index");

db.init();

require("dotenv").config();

const app = express();
const port = process.env.PORT || "8000";

const session = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
};

const authRouter = require("./routes/auth");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(expressSession(session));
app.use(function (req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !!msgs.length;
  req.session.messages = [];
  next();
});
app.use(passport.initialize());
app.use(passport.authenticate("session"));

app.use(authRouter);

const apiRouter = require("./routes/api");
app.use(apiRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
