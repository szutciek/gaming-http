const express = require("express");
const app = express();
const firRouter = require("./routes/firRouter");
const mailRouter = require("./routes/mailRouter");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");

const apiRouter = require("./routes/apiRouter");
const panelRouter = require("./routes/panelRouter");
const authenticationStation = require("./controllers/authenticationStation");
const gameController = require("./controllers/gameController");

const errorSender = require("./utils/errorSender");

// process.on("uncaughtException", function (err) {
//   console.log("Caught exception: " + err);
// });

app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/KanapkaStudios")
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

app.use(express.json());

// Send basic assets ----------------------------------------------------------------------- Send basic assets

// CHANGE ---
app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "pages/panel.html"));
});
app.get("/home", (req, res, next) => {
  res.sendFile(path.join(__dirname, "pages/home.html"));
});
// --- ---
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public/favicon.png"));
});

app.get("/log-in", (req, res, next) =>
  res.sendFile(path.join(__dirname, "pages/login.html"))
);
app.get("/create-account", (req, res, next) =>
  res.sendFile(path.join(__dirname, "pages/createAccount.html"))
);
app.get("/play/:string", (req, res, next) => {
  res.sendFile(path.join(__dirname, "pages/firpage.html"));
});

// Route to routers ------------------------------------------------------------------------ Route to routers

app.use("/api", apiRouter);
// app.use("/mail", mailRouter);
app.use("/fir", firRouter);

// Restrict to admins ---------------------------------------------------------------------- Restrict to admins

app.get(
  "/admin",
  authenticationStation.protect,
  authenticationStation.restrict(["admin", "ceo"]),
  (req, res, next) => {
    res.sendFile(path.join(__dirname, "pages/home.html"));
  }
);

// Send panel pages ------------------------------------------------------------------------ Send panel pages

app.use("/", panelRouter);

// Handle rest of the requests ------------------------------------------------------------- Handle mistakes

app.use("*", (req, res, next) => {
  res.send("Missing");
});

app.use(errorSender);

app.listen(7070, () => console.log("Listeing on port 7070"));
