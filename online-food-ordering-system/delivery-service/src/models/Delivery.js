const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    driver_name: {
      type: String,
      required: true,
      trim: true
    },
    driver_phone: {
      type: String,
      required: true,
      trim: true
    },
    delivery_address: {
      type: String,
      required: true,
      trim: true
    },
    delivery_status: {
      type: String,
      required: true,
      enum: [
        "ASSIGNED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED"
      ],
      default: "ASSIGNED"
    },
    assigned_at: {
      type: String,
      required: true
    },
    delivered_at: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Delivery", deliverySchema);