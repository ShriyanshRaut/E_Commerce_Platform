export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  description: string;
  minSubtotal?: number;
}

// 🧾 ORDER (FINAL HYBRID STRUCTURE)
export interface Order {
  id: string;
  date: string;
  items: CartItem[];

  // 💰 REQUIRED
  total: number;

  // 📦 REQUIRED for UI badge
  status: "processing" | "shipped" | "delivered";

  // 🎟 OPTIONAL (UI only)
  couponCode?: string;
  discount?: number;
}