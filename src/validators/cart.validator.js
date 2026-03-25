import { z } from "zod"

const addToCartSchema = z.object({
    productId: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
    quantity: z.number().int().positive("Quantity must be a positive number").default(1)
})

const updateCartItemSchema = z.object({
    productId: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
    quantity: z.number().int().positive("Quantity must be a positive number")
})

const removeFromCartSchema = z.object({
    productId: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID")
})

export { addToCartSchema, updateCartItemSchema, removeFromCartSchema }