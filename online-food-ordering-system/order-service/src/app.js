const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const orderRoutes = require("./routes/orderRoutes");
const notFound = require("./middleware/notFoundMiddleware");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));


app.get("/", (req, res) => res.send("Order Service Running"));

app.use("/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
