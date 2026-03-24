import mongoose from "mongoose";

const { Schema } = mongoose;

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          default: 1
        }
      }
    ],
    totalPrice: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;