import { ORDER_STATUS } from "../constants/orderStatus.js";
import { PAYMENT_STATUS } from "../constants/paymentStatus.js";

// ...
const order = await Order.create({
  user: userId,
  items: cart.items.map((item) => ({
    productId: item.productId._id,
    quantity: item.quantity,
    priceAtPurchase: item.productId.price,
  })),
  totalPrice,
  shippingAddress,
  status: ORDER_STATUS.PENDING,
  paymentStatus: PAYMENT_STATUS.PENDING,
});