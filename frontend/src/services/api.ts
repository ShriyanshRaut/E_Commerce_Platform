import type { Product } from "@/types";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const API_BASE_URL = "http://localhost:8000/api/v1";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Aether Runner",
    price: 8999,
    image: product1,
    category: "Footwear",
    description: "Lightweight performance sneaker engineered for everyday motion.",
  },
  {
    id: "2",
    name: "Sonic Wave Pro",
    price: 24999,
    image: product2,
    category: "Audio",
    description: "Studio-grade wireless headphones with adaptive noise cancelling.",
  },
  {
    id: "3",
    name: "Pulse Watch X",
    price: 32999,
    image: product3,
    category: "Wearables",
    description: "Minimal smartwatch with precision health tracking.",
  },
  {
    id: "4",
    name: "Voyager Pack",
    price: 12499,
    image: product4,
    category: "Bags",
    description: "Premium leather backpack built for the modern commute.",
  },
  {
    id: "5",
    name: "Eclipse Shades",
    price: 6499,
    image: product5,
    category: "Accessories",
    description: "Polarized lenses with a timeless matte black frame.",
  },
  {
    id: "6",
    name: "Onyx Brew Mug",
    price: 1299,
    image: product6,
    category: "Lifestyle",
    description: "Handcrafted matte ceramic mug with a soft-touch finish.",
  },
];

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_BASE_URL}${path}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return (await res.json()) as T;
  } catch {
    // Graceful fallback to mock data when API is unavailable
    return fallback;
  }
}

export const productService = {
  async getProducts(): Promise<Product[]> {
    // Simulate network latency for skeletons
    await new Promise((r) => setTimeout(r, 600));
    return safeFetch<Product[]>("/products", MOCK_PRODUCTS);
  },
};
