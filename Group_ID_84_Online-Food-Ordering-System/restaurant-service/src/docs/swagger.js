const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Restaurant Service API",
    version: "1.0.0",
    description: "APIs to manage restaurants"
  },
  paths: {
    "/restaurants": {
      post: {
        summary: "Create a restaurant",
        tags: ["Restaurants"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  restaurant_name: { type: "string" },
                  name: { type: "string" },
                  address: { type: "string" },
                  phone: { type: "string" },
                  email: { type: "string" },
                  cuisine: { type: "string" },
                  status: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "201": { description: "Restaurant created successfully" },
          "400": { description: "Error creating restaurant" }
        }
      },
      get: {
        summary: "Get all restaurants",
        tags: ["Restaurants"],
        responses: {
          "200": { description: "List of all restaurants" },
          "500": { description: "Error fetching restaurants" }
        }
      }
    },
    "/restaurants/{id}": {
      get: {
        summary: "Get a restaurant by ID",
        tags: ["Restaurants"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The restaurant ID"
          }
        ],
        responses: {
          "200": { description: "Restaurant details" },
          "404": { description: "Restaurant not found" },
          "500": { description: "Error fetching restaurant" }
        }
      },
      put: {
        summary: "Update a restaurant by ID",
        tags: ["Restaurants"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The restaurant ID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  restaurant_name: { type: "string" },
                  name: { type: "string" },
                  address: { type: "string" },
                  phone: { type: "string" },
                  email: { type: "string" },
                  cuisine: { type: "string" },
                  status: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Restaurant updated successfully" },
          "400": { description: "Error updating restaurant" },
          "404": { description: "Restaurant not found" }
        }
      },
      delete: {
        summary: "Delete a restaurant by ID",
        tags: ["Restaurants"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The restaurant ID"
          }
        ],
        responses: {
          "200": { description: "Restaurant deleted successfully" },
          "404": { description: "Restaurant not found" },
          "500": { description: "Error deleting restaurant" }
        }
      }
    },
    "/restaurants/{id}/menus": {
      get: {
        summary: "Get menus by restaurant ID",
        tags: ["Restaurants"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The restaurant ID"
          }
        ],
        responses: {
          "200": { description: "List of restaurant menu items" },
          "404": { description: "Restaurant not found" },
          "500": { description: "Error fetching restaurant menus" }
        }
      }
    },
    "/restaurants/{id}/status": {
      put: {
        summary: "Update restaurant status",
        tags: ["Restaurants"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The restaurant ID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" }
                },
                required: ["status"]
              }
            }
          }
        },
        responses: {
          "200": { description: "Restaurant status updated" },
          "400": { description: "status is required" },
          "404": { description: "Restaurant not found" },
          "500": { description: "Error updating restaurant status" }
        }
      }
    }
  }
};

module.exports = swaggerSpec;