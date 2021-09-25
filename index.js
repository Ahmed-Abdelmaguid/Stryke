const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const key = require("./keys/key");
const app = express();

const authRoutes = require("./routes/auth");

mongoose
  .connect(key.mongoURI)
  .then(() => {
    console.log("Mongodb is running");
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());

app.use("/api", authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
