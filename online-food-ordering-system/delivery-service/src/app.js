const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Delivery Service Running");
});

app.use("/deliveries", deliveryRoutes);

module.exports = app;