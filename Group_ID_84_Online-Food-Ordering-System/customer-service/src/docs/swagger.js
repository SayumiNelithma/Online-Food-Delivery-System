const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Customer Service API",
    version: "1.0.0",
    description: "APIs to manage customers"
  },
  paths: {
    "/customers": {
      post: {
        summary: "Create a customer",
        tags: ["Customers"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  address: { type: "string" }
                },
                required: ["name", "email"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Customer created successfully" },
          "400": { description: "Error creating customer" }
        }
      },
      get: {
        summary: "Get all customers",
        tags: ["Customers"],
        responses: {
          "200": { description: "List of all customers" },
          "500": { description: "Error fetching customers" }
        }
      }
    },
    "/customers/{id}": {
      get: {
        summary: "Get a customer by ID",
        tags: ["Customers"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: { type: "string" },
            required: true,
            description: "The customer ID"
          }
        ],
        responses: {
          "200": { description: "Customer details" },
          "404": { description: "Customer not found" },
          "500": { description: "Error fetching customer" }
        }
      },
      put: {
        summary: "Update a customer by ID",
        tags: ["Customers"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: { type: "string" },
            required: true,
            description: "The customer ID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  address: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Customer updated successfully" },
          "400": { description: "Error updating customer" },
          "404": { description: "Customer not found" }
        }
      },
      delete: {
        summary: "Delete a customer by ID",
        tags: ["Customers"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: { type: "string" },
            required: true,
            description: "The customer ID"
          }
        ],
        responses: {
          "200": { description: "Customer deleted successfully" },
          "404": { description: "Customer not found" },
          "500": { description: "Error deleting customer" }
        }
      }
    },
    "/customers/{id}/orders": {
      get: {
        summary: "Get orders by customer ID",
        tags: ["Customers"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: { type: "string" },
            required: true,
            description: "The customer ID"
          }
        ],
        responses: {
          "200": { description: "List of customer orders" },
          "404": { description: "Customer not found" },
          "500": { description: "Error fetching customer orders" }
        }
      }
    },
    "/customers/{id}/payments": {
      get: {
        summary: "Get payments by customer ID",
        tags: ["Customers"],
        parameters: [
          {
            in: "path",
            name: "id",
            schema: { type: "string" },
            required: true,
            description: "The customer ID"
          }
        ],
        responses: {
          "200": { description: "List of customer payments" },
          "404": { description: "Customer not found" },
          "500": { description: "Error fetching customer payments" }
        }
      }
    }
  }
};

module.exports = swaggerSpec;