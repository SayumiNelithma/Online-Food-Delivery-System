const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(
    "/api/restaurants",
    createProxyMiddleware({
        target: process.env.RESTAURANT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/api/restaurants": "/restaurants"
        }
    })
);

app.get("/", (req, res) => {
    res.send("API Gateway Running");
});

module.exports = app;
