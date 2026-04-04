const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const paymentSchema = new mongoose.Schema(
	{
		paymentId: {
			type: String,
			required: true,
			unique: true,
			default: () => uuidv4()
		},
		userId: {
			type: String,
			required: true
		},
		orderId: {
			type: String,
			required: true
		},
		amount: {
			type: Number,
			required: true,
			min: 0
		},
		status: {
			type: String,
			enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
			default: "PENDING"
		}
	},
	{
		timestamps: { createdAt: "createdAt", updatedAt: false }
	}
);

module.exports = mongoose.model("Payment", paymentSchema);
