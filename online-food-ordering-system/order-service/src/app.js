const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const orderRoutes = require("./routes/orderRoutes");
const notFound = require("./middleware/notFoundMiddleware");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Order Service Running"));

app.use("/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
