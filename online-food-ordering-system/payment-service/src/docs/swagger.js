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
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									userId: { type: "string" },
									orderId: { type: "string" },
									amount: { type: "number" }
								},
								required: ["userId", "orderId", "amount"]
							}
						}
					}
				},
				responses: { "201": { description: "Payment initiated" } }
			}
		}
	}
};

module.exports = swaggerSpec;
