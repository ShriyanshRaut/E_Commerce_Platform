import Cart from "../models/cart.model.js";
import ApiError from "../utils/ApiError.js";

export const getCartService = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};