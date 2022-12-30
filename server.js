const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const event = require("./routes/event");
const user = require("./routes/user");
const verify = require("./routes/verify");
const ip = require("ip");
require("dotenv").config();

require("dotenv/config");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, () => {
  console.log("Connected to MongoDB");
});

app.use(express.static("./images"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/event", event);
app.use("/user", user);
app.use("/verify",verify);

app.get("/", (req, res) => {
  console.log(req.url);
  console.log(req.headers);
  console.log(req.body);
  console.log(req.ip);
  res.send(req.headers, req.data, req.ip, req.router, req.body);
});
app.get("/nukes", (req, res) => {
  try {
    res.json({ isNukesActive: true });
  } catch (err) {
    console.log(err);
    res.json({ code: err.code, message: err.message });
  }
});
app.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://${ip.address()}:${port}`);
});

module.exports = app;
