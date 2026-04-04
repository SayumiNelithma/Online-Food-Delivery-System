const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Delivery Service API",
    version: "1.0.0",
    description: "APIs to manage deliveries"
  },
  paths: {
    "/deliveries": {
      post: {
        summary: "Create a delivery",
        tags: ["Deliveries"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  order_id: { type: "string" },
                  delivery_address: { type: "string" },
                  rider_name: { type: "string" },
                  driver_name: { type: "string" },
                  driver_phone: { type: "string" },
                  delivery_status: {
                    type: "string",
                    enum: ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"]
                  },
                  assigned_at: {
                    type: "string",
                    format: "date-time"
                  },
                  delivered_at: {
                    type: "string",
                    format: "date-time",
                    nullable: true
                  }
                },
                required: ["order_id", "delivery_address"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Delivery created successfully" },
          "400": { description: "order_id and delivery_address are required" },
          "404": { description: "Order not found" },
          "500": { description: "Error creating delivery" }
        }
      },
      get: {
        summary: "Get all deliveries",
        tags: ["Deliveries"],
        responses: {
          "200": { description: "List of all deliveries" },
          "500": { description: "Error fetching deliveries" }
        }
      }
    },
    "/deliveries/{id}": {
      get: {
        summary: "Get a delivery by ID",
        tags: ["Deliveries"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The delivery ID"
          }
        ],
        responses: {
          "200": { description: "Delivery details" },
          "404": { description: "Delivery not found" },
          "500": { description: "Error fetching delivery" }
        }
      },
      put: {
        summary: "Update a delivery by ID",
        tags: ["Deliveries"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The delivery ID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  order_id: { type: "string" },
                  delivery_address: { type: "string" },
                  rider_name: { type: "string" },
                  driver_name: { type: "string" },
                  driver_phone: { type: "string" },
                  delivery_status: {
                    type: "string",
                    enum: ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"]
                  },
                  assigned_at: {
                    type: "string",
                    format: "date-time"
                  },
                  delivered_at: {
                    type: "string",
                    format: "date-time",
                    nullable: true
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Delivery updated successfully" },
          "400": { description: "Invalid delivery update data" },
          "404": { description: "Delivery not found" }
        }
      },
      delete: {
        summary: "Delete a delivery by ID",
        tags: ["Deliveries"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The delivery ID"
          }
        ],
        responses: {
          "200": { description: "Delivery deleted successfully" },
          "404": { description: "Delivery not found" },
          "500": { description: "Error deleting delivery" }
        }
      }
    },
    "/deliveries/order/{orderId}": {
      get: {
        summary: "Get delivery by order ID",
        tags: ["Deliveries"],
        parameters: [
          {
            in: "path",
            name: "orderId",
            required: true,
            schema: { type: "string" },
            description: "The order ID"
          }
        ],
        responses: {
          "200": { description: "Delivery details for the order" },
          "404": { description: "Delivery not found for this order" },
          "500": { description: "Error fetching delivery by order ID" }
        }
      }
    },
    "/deliveries/rider/{riderName}": {
      get: {
        summary: "Get deliveries by rider name",
        tags: ["Deliveries"],
        parameters: [
          {
            in: "path",
            name: "riderName",
            required: true,
            schema: { type: "string" },
            description: "The rider name"
          }
        ],
        responses: {
          "200": { description: "List of deliveries assigned to the rider" },
          "500": { description: "Error fetching deliveries by rider" }
        }
      }
    }
  }
};

module.exports = swaggerSpec;