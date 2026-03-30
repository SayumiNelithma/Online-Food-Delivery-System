const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const paymentRoutes = require("./routes/paymentRoutes");
const notFound = require("./middleware/notFoundMiddleware");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => res.send("Payment Service Running"));

app.use("/payments", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
