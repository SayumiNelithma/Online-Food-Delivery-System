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

// ── Swagger UI proxy routes (must be BEFORE generic service routes) ──────────
// swagger-ui-express issues a 301 redirect /api-docs → /api-docs/ with an
// absolute Location header. Without rewriting it the browser follows to the
// gateway root (/api-docs/) and gets a 404. We fix both issues here:
//   1. pathRewrite prepends /api-docs to the stripped path Express hands over
//   2. proxyRes hook rewrites the Location header back to the gateway prefix

function makeSwaggerProxy(target, gatewayPrefix) {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path) => `/api-docs${path}`,
    on: {
      proxyRes(proxyRes) {
        const location = proxyRes.headers["location"];
        if (location && location.startsWith("/api-docs")) {
          proxyRes.headers["location"] = location.replace(
            "/api-docs",
            gatewayPrefix
          );
        }
      },
    },
  });
}

app.use("/api/customers/api-docs",  makeSwaggerProxy(process.env.CUSTOMER_SERVICE_URL,   "/api/customers/api-docs"));
app.use("/api/restaurants/api-docs", makeSwaggerProxy(process.env.RESTAURANT_SERVICE_URL, "/api/restaurants/api-docs"));
app.use("/api/menus/api-docs",       makeSwaggerProxy(process.env.MENU_SERVICE_URL,        "/api/menus/api-docs"));
app.use("/api/orders/api-docs",      makeSwaggerProxy(process.env.ORDER_SERVICE_URL,       "/api/orders/api-docs"));
app.use("/api/payments/api-docs",    makeSwaggerProxy(process.env.PAYMENT_SERVICE_URL,     "/api/payments/api-docs"));
app.use("/api/deliveries/api-docs",  makeSwaggerProxy(process.env.DELIVERY_SERVICE_URL,    "/api/deliveries/api-docs"));

// ── Generic service proxy routes ─────────────────────────────────────────────

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

// order-service
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const extraPath = req.originalUrl.replace("/api/orders", "");
      return `/orders${extraPath}`;
    }
  })
);

// payment-service
app.use(
  "/api/payments",
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const extraPath = req.originalUrl.replace("/api/payments", "");
      return `/payments${extraPath}`;
    }
  })
);

// delivery-service
app.use(
  "/api/deliveries",
  createProxyMiddleware({
    target: process.env.DELIVERY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const extraPath = req.originalUrl.replace("/api/deliveries", "");
      return `/deliveries${extraPath}`;
    }
  })
);

module.exports = app;