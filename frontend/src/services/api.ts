import type { Product } from "@/types";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * Backend response shape
 */
type ApiResponse<T> = {
  success: boolean;
  data: T;
};

/**
 * Backend product shape
 */
type BackendProduct = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  description?: string;
};

/**
 * Mock fallback
 */
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

/**
 * Safe fetch with timeout + proper typing
 */
async function safeFetch<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    const json: ApiResponse<T> = await res.json();

    if (!json.success) {
      throw new Error("API responded with success=false");
    }

    return json.data;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Transform backend → frontend
 */
function transformProduct(p: BackendProduct): Product {
  return {
    id: p._id, // 🔥 CRITICAL: this must be Mongo _id
    name: p.name,
    price: p.price,
    image: p.images?.[0] || product1,
    category: p.category || "General",
    description: p.description || "",
  };
}

/**
 * Product service
 */
export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      await new Promise((r) => setTimeout(r, 600)); // UX smoothness

      const data = await safeFetch<BackendProduct[]>("/products");

      return data.map(transformProduct);
    } catch (err) {
      console.warn("⚠️ API failed, using mock data:", err);
      return MOCK_PRODUCTS;
    }
  },
};