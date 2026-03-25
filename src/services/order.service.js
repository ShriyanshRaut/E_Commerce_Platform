import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import ApiError from "../utils/ApiError.js";

export const createOrderService = async (userId, shippingAddress) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const order = await Order.create({
    user: userId,
    items: cart.items,
    totalPrice: cart.totalPrice,
    shippingAddress
  });

  // clear cart after order
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  return order;
};