const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// health check
app.get("/", (req, res) => {
    res.send("API Gateway Running");
});

// customer-service
app.use(
    "/api/customers",
    createProxyMiddleware({
        target: process.env.CUSTOMER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/api/customers": "/customers"
        }
    })
);

// restaurant-service
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

// menu-service
app.use(
    "/api/menus",
    createProxyMiddleware({
        target: process.env.MENU_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/api/menus": "/menus"
        }
    })
);

// order-service
app.use(
    "/api/orders",
    createProxyMiddleware({
        target: process.env.ORDER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/api/orders": "/orders"
        }
    })
);

// payment-service
app.use(
    "/api/payments",
    createProxyMiddleware({
        target: process.env.PAYMENT_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/api/payments": "/payments"
        }
    })
);

// delivery-service
app.use(
    "/api/deliveries",
    createProxyMiddleware({
        target: process.env.DELIVERY_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/api/deliveries": "/deliveries"
        }
    })
);

module.exports = app;