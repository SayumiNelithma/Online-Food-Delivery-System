const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const customerRoutes = require("./routes/customerRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Customer Service Running");
});

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yml"));
app.use("/customers/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/customers", customerRoutes);

module.exports = app;