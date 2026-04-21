import type { Coupon } from "../types";

const BASE_URL = "http://localhost:8000/api/v1";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

//  UI SUGGESTIONS (Lovable needs this)
export const COUPONS: { code: string }[] = [
  { code: "WELCOME10" },
  { code: "FLAT500" },
  { code: "MEGA20" },
];

//  Fetch coupon from backend
export async function findCoupon(code: string): Promise<Coupon | null> {
  try {
    const res = await fetch(`${BASE_URL}/coupons/${code}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!res.ok) return null;

    const data = await res.json();

    // assuming backend returns { data: coupon }
    return data.data;
  } catch (err) {
    console.error("Coupon fetch failed", err);
    return null;
  }
}

//  SAME CALC LOGIC (UI depends on this)
export function calcDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0;

  if (coupon.type === "percent") {
    return Math.round((subtotal * coupon.value) / 100);
  }

  return Math.min(coupon.value, subtotal);
}