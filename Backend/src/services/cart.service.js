import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

export const getCartService = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate("items.productId");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
  }

  return cart;
};

export const addToCartService = async (userId, productId, quantity) => {
  const product = await Product.findById(productId); // ✅ back to correct method

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity: quantity || 1,
    });
  }

  // 🔥 FIX: calculate total price properly
  let total = 0;

  for (const item of cart.items) {
    const prod = await Product.findById(item.productId);
    if (!prod) continue;
    total += prod.price * item.quantity;
  }

  cart.totalPrice = total;

  await cart.save();

  return await cart.populate("items.productId");
};