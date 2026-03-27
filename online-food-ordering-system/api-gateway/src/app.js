const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API Gateway Running");
});

// customer-service
app.use(
  "/api/customers",
  createProxyMiddleware({
    target: process.env.CUSTOMER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const extraPath = req.originalUrl.replace("/api/customers", "");
      return `/customers${extraPath}`;
    }
  })
);

// restaurant-service
app.use(
  "/api/restaurants",
  createProxyMiddleware({
    target: process.env.RESTAURANT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const extraPath = req.originalUrl.replace("/api/restaurants", "");
      return `/restaurants${extraPath}`;
    }
  })
);

// menu-service
app.use(
  "/api/menus",
  createProxyMiddleware({
    target: process.env.MENU_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const extraPath = req.originalUrl.replace("/api/menus", "");
      return `/menus${extraPath}`;
    }
  })
);

module.exports = app;