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

// ── Gateway-level Swagger UI (multi-service dropdown) ────────────────────────
// Uses swagger-ui-dist directly so the urls[] dropdown is 100% reliable.
const swaggerUiDist = require("swagger-ui-dist");

// Serve swagger-ui static assets under /api-docs/assets/
app.use("/api-docs/assets", express.static(swaggerUiDist.absolutePath()));

// Serve the custom HTML page at /api-docs  (and /api-docs/)
const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Online Food Delivery – API Gateway Docs</title>
  <link rel="stylesheet" href="/api-docs/assets/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/api-docs/assets/swagger-ui-bundle.js"></script>
  <script src="/api-docs/assets/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      SwaggerUIBundle({
        urls: [
          { name: "Customer Service",   url: "/api/customers/api-docs.json" },
          { name: "Restaurant Service", url: "/api/restaurants/api-docs.json" },
          { name: "Menu Service",       url: "/api/menus/api-docs.json" },
          { name: "Order Service",      url: "/api/orders/api-docs.json" },
          { name: "Payment Service",    url: "/api/payments/api-docs.json" },
          { name: "Delivery Service",   url: "/api/deliveries/api-docs.json" }
        ],
        "urls.primaryName": "Customer Service",
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout",
        deepLinking: true
      });
    };
  </script>
</body>
</html>`;

app.get("/api-docs", (req, res) => res.send(swaggerHtml));
app.get("/api-docs/", (req, res) => res.send(swaggerHtml));


// ── JSON spec proxy routes (so Swagger UI can fetch each service's spec) ─────
// These proxy /api/*/api-docs.json → each service's /api-docs.json
app.get("/api/customers/api-docs.json",   createProxyMiddleware({ target: process.env.CUSTOMER_SERVICE_URL,   changeOrigin: true, pathRewrite: { ".*": "/api-docs.json" } }));
app.get("/api/restaurants/api-docs.json", createProxyMiddleware({ target: process.env.RESTAURANT_SERVICE_URL, changeOrigin: true, pathRewrite: { ".*": "/api-docs.json" } }));
app.get("/api/menus/api-docs.json",       createProxyMiddleware({ target: process.env.MENU_SERVICE_URL,        changeOrigin: true, pathRewrite: { ".*": "/api-docs.json" } }));
app.get("/api/orders/api-docs.json",      createProxyMiddleware({ target: process.env.ORDER_SERVICE_URL,       changeOrigin: true, pathRewrite: { ".*": "/api-docs.json" } }));
app.get("/api/payments/api-docs.json",    createProxyMiddleware({ target: process.env.PAYMENT_SERVICE_URL,    changeOrigin: true, pathRewrite: { ".*": "/api-docs.json" } }));
app.get("/api/deliveries/api-docs.json",  createProxyMiddleware({ target: process.env.DELIVERY_SERVICE_URL,   changeOrigin: true, pathRewrite: { ".*": "/api-docs.json" } }));

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