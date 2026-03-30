const swaggerSpec = {
	openapi: "3.0.0",
	info: {
		title: "Payment Service API",
		version: "1.0.0",
		description: "APIs to manage payments"
	},
	paths: {
		"/payments/initiate": {
			post: {
				summary: "Initiate payment",
				tags: ["Payments"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									userId: { type: "string" },
									orderId: { type: "string" },
								},
								required: ["userId", "orderId"]
							}
						}
					}
				},
				responses: { 
					"201": { description: "Payment initiated" },
					"400": { description: "Missing fields" },
					"404": { description: "User or Order not found" },
					"500": { description: "Server error" }
				}
			}
		},
		"/payments/confirm": {
			post: {
				summary: "Confirm a payment",
				tags: ["Payments"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									paymentId: { type: "string" }
								},
								required: ["paymentId"]
							}
						}
					}
				},
				responses: { 
					"200": { description: "Payment confirmed" },
					"400": { description: "paymentId is required" },
					"404": { description: "Payment not found" },
					"500": { description: "Server error" }
				}
			}
		},
		"/payments/cancel": {
			post: {
				summary: "Cancel a payment",
				tags: ["Payments"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									paymentId: { type: "string" }
								},
								required: ["paymentId"]
							}
						}
					}
				},
				responses: { 
					"200": { description: "Payment cancelled" },
					"400": { description: "paymentId is required" },
					"404": { description: "Payment not found" },
					"500": { description: "Server error" }
				}
			}
		},
		"/payments/refund": {
			post: {
				summary: "Refund a payment",
				tags: ["Payments"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									paymentId: { type: "string" }
								},
								required: ["paymentId"]
							}
						}
					}
				},
				responses: { 
					"200": { description: "Payment refunded" },
					"400": { description: "paymentId is required" },
					"404": { description: "Payment not found" },
					"500": { description: "Server error" }
				}
			}
		},
		"/payments/webhook": {
			post: {
				summary: "Handle payment webhooks",
				tags: ["Payments"],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									paymentId: { type: "string" },
									status: { type: "string", enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"] }
								},
								required: ["paymentId", "status"]
							}
						}
					}
				},
				responses: { 
					"200": { description: "Webhook processed" },
					"400": { description: "Invalid status or missing fields" },
					"404": { description: "Payment not found" },
					"500": { description: "Server error" }
				}
			}
		},
		"/payments/{paymentId}": {
			get: {
				summary: "Get a payment by ID",
				tags: ["Payments"],
				parameters: [
					{
						in: "path",
						name: "paymentId",
						schema: { type: "string" },
						required: true,
						description: "The payment ID"
					}
				],
				responses: { 
					"200": { description: "Payment details" },
					"404": { description: "Payment not found" },
					"500": { description: "Server error" }
				}
			}
		},
		"/payments/order/{orderId}": {
			get: {
				summary: "Get payments by order ID",
				tags: ["Payments"],
				parameters: [
					{
						in: "path",
						name: "orderId",
						schema: { type: "string" },
						required: true,
						description: "The order ID"
					}
				],
				responses: { 
					"200": { description: "List of payments for the order" },
					"500": { description: "Server error" }
				}
			}
		},
		"/payments/user/{userId}": {
			get: {
				summary: "Get payments by user ID",
				tags: ["Payments"],
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
					"200": { description: "List of payments for the user" },
					"500": { description: "Server error" }
				}
			}
		},
		"/payments/status/{paymentId}": {
			get: {
				summary: "Get the status of a payment",
				tags: ["Payments"],
				parameters: [
					{
						in: "path",
						name: "paymentId",
						schema: { type: "string" },
						required: true,
						description: "The payment ID"
					}
				],
				responses: { 
					"200": { description: "Payment status" },
					"404": { description: "Payment not found" },
					"500": { description: "Server error" }
				}
			}
		}
	}
};

module.exports = swaggerSpec;
