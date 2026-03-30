const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const menuRoutes = require("./routes/menuRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Menu Service Running");
});

const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yml"));
app.use("/menus/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/menus", menuRoutes);

module.exports = app;