import type { Order } from "@/types";

const BASE_URL = "http://localhost:8000/api/v1";

// 🔐 headers
const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// 🧠 backend order shape (NO any)
type BackendOrder = {
  _id?: string;
  id?: string;
  createdAt?: string;
  date?: string;
  items?: unknown[]; // safe alternative to any
  total?: number;
  status?: "processing" | "shipped" | "delivered";
  couponCode?: string;
  discount?: number;
};

// 💾 fallback local storage
const KEY = "eshop_orders_v1";

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function saveLocalOrder(order: Order) {
  const all = getLocalOrders();
  all.unshift(order);
  localStorage.setItem(KEY, JSON.stringify(all));
}

// 📦 FETCH ORDERS
export async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${BASE_URL}/orders/my`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Failed to fetch orders");

    const data = await res.json();

    const backendOrders: BackendOrder[] = data.data || [];

    const orders: Order[] = backendOrders.map((o) => ({
      id: o._id || o.id || "",
      date: o.createdAt || o.date || "",
      items: (o.items || []) as Order["items"], // safe cast
      total: o.total || 0,

      status: o.status || "processing",
      couponCode: o.couponCode || undefined,
      discount: o.discount || 0,
    }));

    return orders;
  } catch (err) {
    console.warn("⚠️ Backend orders failed, using local fallback");
    return getLocalOrders();
  }
}

// 💾 SAVE ORDER
export async function saveOrder(order: Order) {
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error("Failed to save order");

    return await res.json();
  } catch (err) {
    console.warn("⚠️ Backend save failed, saving locally");
    saveLocalOrder(order);
  }
}

// 🆔 ORDER ID
export function generateOrderId(): string {
  return "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}