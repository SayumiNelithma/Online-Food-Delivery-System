const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const restaurantRoutes = require("./routes/restaurantRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Restaurant Service Running");
});

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yml"));
app.use("/restaurants/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/restaurants", restaurantRoutes);

module.exports = app;