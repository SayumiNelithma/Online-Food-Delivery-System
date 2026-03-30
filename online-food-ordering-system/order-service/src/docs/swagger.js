const swaggerSpec = {
	openapi: "3.0.0",
	info: {
		title: "Order Service API",
		version: "1.0.0",
		description: "APIs to manage orders"
	},
	paths: {
		"/orders": {
			post: {
				summary: "Create a new order",
				tags: ["Orders"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									userId: { type: "string" },
									restaurantId: { type: "string" },
									items: {
										type: "array",
										items: {
											type: "object",
											properties: {
												menuItemId: { type: "string" },
												quantity: { type: "number" }
											},
											required: ["menuItemId", "quantity"]
										}
									}
								},
								required: ["userId", "restaurantId", "items"]
							}
						}
					}
				},
				responses: {
					"201": { description: "Order created successfully" },
					"400": { description: "Missing fields or invalid data" },
					"404": { description: "User, restaurant, or menu item not found" },
					"500": { description: "Server error" }
				},
			},
			get: {
				summary: "Get all orders",
				tags: ["Orders"],
				responses: {
					"200": { description: "List of orders" },
					"500": { description: "Server error" }
				}
			}
		},
		"/orders/user/{userId}": {
			get: {
				summary: "Get orders by user ID",
				tags: ["Orders"],
				parameters: [
					{
						in: "path",
						name: "userId",
						schema: { type: "string" },
						required: true,
						description: "The user ID"
					}
				],
				responses: {
					"200": { description: "List of user orders" },
					"500": { description: "Server error" }
				}
			}
		},
		"/orders/{id}": {
			get: {
				summary: "Get an order by ID",
				tags: ["Orders"],
				parameters: [
					{
						in: "path",
						name: "id",
						schema: { type: "string" },
						required: true,
						description: "The order ID"
					}
				],
				responses: {
					"200": { description: "Order details" },
					"404": { description: "Order not found" },
					"500": { description: "Server error" }
				}
			}
		},
		"/orders/{id}/status": {
			put: {
				summary: "Update order status",
				tags: ["Orders"],
				parameters: [
					{
						in: "path",
						name: "id",
						schema: { type: "string" },
						required: true,
						description: "The order ID"
					}
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									status: { type: "string", enum: ["CREATED", "PAID", "CANCELLED"] }
								},
								required: ["status"]
							}
						}
					}
				},
				responses: {
					"200": { description: "Order status updated" },
					"400": { description: "Status is required" },
					"404": { description: "Order not found" },
					"500": { description: "Server error" }
				}
			}
		},
		"/orders/{id}/payments": {
			get: {
				summary: "Get payments for an order",
				tags: ["Orders"],
				parameters: [
					{
						in: "path",
						name: "id",
						schema: { type: "string" },
						required: true,
						description: "The order ID"
					}
				],
				responses: {
					"200": { description: "List of payments" },
					"500": { description: "Server error" }
				}
			}
		},
		"/orders/{id}/refund": {
			post: {
				summary: "Refund an order",
				tags: ["Orders"],
				parameters: [
					{
						in: "path",
						name: "id",
						schema: { type: "string" },
						required: true,
						description: "The order ID"
					}
				],
				responses: {
					"200": { description: "Order refunded" },
					"400": { description: "No successful payment found" },
					"404": { description: "Order not found" },
					"500": { description: "Server error" }
				}
			}
		},
		"/orders/{id}/cancel": {
			put: {
				summary: "Cancel an order",
				tags: ["Orders"],
				parameters: [
					{
						in: "path",
						name: "id",
						schema: { type: "string" },
						required: true,
						description: "The order ID"
					}
				],
				responses: {
					"200": { description: "Order cancelled" },
					"400": { description: "Order already cancelled" },
					"404": { description: "Order not found" },
					"500": { description: "Server error" }
				}
			}
		}
	}
};

module.exports = swaggerSpec;
