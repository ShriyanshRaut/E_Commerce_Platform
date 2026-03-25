import { z } from "zod";

const createOrderSchema = z.object({
  shippingAddress: z
    .string()
    .trim()
    .min(5, "Shipping address must be at least 5 characters long")
});

export { createOrderSchema };