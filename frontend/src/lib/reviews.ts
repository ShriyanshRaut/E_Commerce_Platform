import type { Review } from "../types";

const BASE_URL = "http://localhost:8000/api/v1";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

// 🧠 backend response shape (typed, no any)
type ReviewsResponse = {
  data?: Review[];
};

// 💾 fallback (your original data stays alive)
const REVIEWS: Review[] = [
  { id: "r1", productId: "1", author: "Aarav S.", rating: 5, comment: "Insanely comfortable. Wear them all day, no fatigue.", date: "2025-03-12" },
  { id: "r2", productId: "1", author: "Meera K.", rating: 4, comment: "Looks premium. Sizing runs slightly small.", date: "2025-02-28" },
  { id: "r3", productId: "2", author: "Rohan B.", rating: 5, comment: "ANC is on another level. Battery lasts forever.", date: "2025-04-02" },
  { id: "r4", productId: "2", author: "Priya N.", rating: 5, comment: "Studio quality sound, worth every rupee.", date: "2025-03-22" },
  { id: "r5", productId: "3", author: "Karan P.", rating: 4, comment: "Sleek and accurate. Wish the strap had more options.", date: "2025-03-15" },
  { id: "r6", productId: "4", author: "Ishita R.", rating: 5, comment: "Leather quality is unreal. Fits a 16\" laptop easily.", date: "2025-04-05" },
  { id: "r7", productId: "5", author: "Vikram T.", rating: 4, comment: "Polarization works great. Lightweight frame.", date: "2025-02-19" },
  { id: "r8", productId: "6", author: "Neha D.", rating: 5, comment: "Beautiful matte finish. Keeps coffee warm longer.", date: "2025-03-01" },
];

// 📦 FETCH REVIEWS
export async function getReviewsFor(productId: string): Promise<Review[]> {
  try {
    const res = await fetch(`${BASE_URL}/reviews/${productId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Failed");

    const data: ReviewsResponse = await res.json();

    return data.data ?? [];
  } catch (err) {
    console.warn("⚠️ Using local reviews fallback");
    return REVIEWS.filter((r) => r.productId === productId);
  }
}

// ⭐ GET RATING (async, UI-safe)
export async function getRatingFor(
  productId: string
): Promise<{ rating: number; count: number }> {
  try {
    const list = await getReviewsFor(productId);

    if (!list.length) return { rating: 0, count: 0 };

    const sum = list.reduce((a, r) => a + r.rating, 0);

    return {
      rating: +(sum / list.length).toFixed(1),
      count: list.length,
    };
  } catch {
    // 🔁 fallback sync calculation
    const list = REVIEWS.filter((r) => r.productId === productId);

    if (!list.length) return { rating: 0, count: 0 };

    const sum = list.reduce((a, r) => a + r.rating, 0);

    return {
      rating: +(sum / list.length).toFixed(1),
      count: list.length,
    };
  }
}

// ✍️ ADD REVIEW
export async function addReview(review: Review) {
  try {
    const res = await fetch(`${BASE_URL}/reviews`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(review),
    });

    if (!res.ok) throw new Error("Failed");

    return await res.json();
  } catch (err) {
    console.warn("⚠️ Review not saved to backend");
  }
}