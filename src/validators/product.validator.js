import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string()).optional(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
});

export { createProductSchema };