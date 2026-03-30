const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const restaurantRoutes = require("./routes/restaurantRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Restaurant Service Running");
});

app.use("/restaurants", restaurantRoutes);

module.exports = app;