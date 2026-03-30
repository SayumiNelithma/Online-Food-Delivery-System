const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const menuRoutes = require("./routes/menuRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Menu Service Running");
});

app.use("/menus", menuRoutes);

module.exports = app;