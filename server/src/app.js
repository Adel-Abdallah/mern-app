const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const passport = require("passport");
const v1 = require("./routes/v1");

const app = express();

// ------------ DB Config --------//
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.connection.on("connected", () => {
  console.log("Connected to the database");
});
mongoose.connection.on("error", err => {
  console.log(`Failed to connect to the database ${err}`);
});
// ------------ Middlewares --------//
app.use(logger("dev"));
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// ------------ Routes --------//
app.use("/api/v1", v1);

// ----------ERRORS-----------//
app.use((req, res, next) => {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, nex) => {
  const status = err.status || 500;
  const error = err.message || "Error processing your request";

  res.status(status).send({
    error: error
  });
});

module.exports = app;
