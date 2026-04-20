const BASE_URL = "http://localhost:8000/api/v1";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// 🔧 Common response handler
const handleResponse = async (res: Response) => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

export const cartService = {
  // 🧾 GET CART
  async getCart() {
    const res = await fetch(`${BASE_URL}/cart`, {
      method: "GET",
      headers: getHeaders(),
    });

    return handleResponse(res);
  },

  // ➕ ADD ITEM TO CART
  async addToCart(productId: string, quantity = 1) {
    const res = await fetch(`${BASE_URL}/cart/add`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });

    return handleResponse(res);
  },

  // 🔼🔽 UPDATE QUANTITY (IMPORTANT: uses type, not number)
  async updateCartItem(
    productId: string,
    type: "increase" | "decrease"
  ) {
    const res = await fetch(`${BASE_URL}/cart/update`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({
        productId,
        type, // 🔥 MUST be "increase" or "decrease"
      }),
    });

    return handleResponse(res);
  },

  // ❌ REMOVE ITEM
  async removeFromCart(productId: string) {
    const res = await fetch(`${BASE_URL}/cart/remove`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ productId }), // 🔥 backend expects body
    });

    return handleResponse(res);
  },
};