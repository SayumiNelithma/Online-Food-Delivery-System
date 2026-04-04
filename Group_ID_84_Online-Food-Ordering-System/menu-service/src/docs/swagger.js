const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Menu Service API",
    version: "1.0.0",
    description: "APIs to manage restaurant menu items"
  },
  paths: {
    "/menus": {
      post: {
        summary: "Create a menu item",
        tags: ["Menus"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  restaurant_id: { type: "string" },
                  item_name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  availability: { type: "boolean" }
                },
                required: ["restaurant_id", "item_name", "price"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Menu item created successfully" },
          "400": {
            description: "restaurant_id, item_name, and price are required"
          },
          "404": { description: "Restaurant not found" },
          "500": { description: "Failed to create menu item" }
        }
      },
      get: {
        summary: "Get all menu items",
        tags: ["Menus"],
        responses: {
          "200": { description: "List of all menu items" },
          "500": { description: "Error fetching menu items" }
        }
      }
    },
    "/menus/{id}": {
      get: {
        summary: "Get a menu item by ID",
        tags: ["Menus"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The menu item ID"
          }
        ],
        responses: {
          "200": { description: "Menu item details" },
          "404": { description: "Menu item not found" },
          "500": { description: "Error fetching menu item" }
        }
      },
      put: {
        summary: "Update a menu item by ID",
        tags: ["Menus"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The menu item ID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  restaurant_id: { type: "string" },
                  item_name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  availability: { type: "boolean" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Menu item updated successfully" },
          "400": { description: "Invalid menu item update data" },
          "404": { description: "Menu item not found" }
        }
      },
      delete: {
        summary: "Delete a menu item by ID",
        tags: ["Menus"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The menu item ID"
          }
        ],
        responses: {
          "200": { description: "Menu item deleted successfully" },
          "404": { description: "Menu item not found" },
          "500": { description: "Error deleting menu item" }
        }
      }
    },
    "/menus/restaurant/{restaurantId}": {
      get: {
        summary: "Get menu items by restaurant ID",
        tags: ["Menus"],
        parameters: [
          {
            in: "path",
            name: "restaurantId",
            required: true,
            schema: { type: "string" },
            description: "The restaurant ID"
          }
        ],
        responses: {
          "200": { description: "List of menu items for the restaurant" },
          "500": { description: "Error fetching menu items by restaurant" }
        }
      },
      delete: {
        summary: "Delete all menu items by restaurant ID",
        tags: ["Menus"],
        parameters: [
          {
            in: "path",
            name: "restaurantId",
            required: true,
            schema: { type: "string" },
            description: "The restaurant ID"
          }
        ],
        responses: {
          "200": {
            description: "Menu items for the restaurant deleted successfully"
          },
          "500": { description: "Error deleting menu items by restaurant" }
        }
      }
    },
    "/menus/{id}/availability": {
      put: {
        summary: "Update menu item availability",
        tags: ["Menus"],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
            description: "The menu item ID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  availability: { type: "boolean" }
                },
                required: ["availability"]
              }
            }
          }
        },
        responses: {
          "200": { description: "Menu item availability updated" },
          "400": { description: "availability boolean is required" },
          "404": { description: "Menu item not found" },
          "500": { description: "Error updating menu item availability" }
        }
      }
    }
  }
};

module.exports = swaggerSpec;