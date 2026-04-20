const BASE_URL = "http://localhost:8000/api/v1";

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
});

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Order failed");
  }
  return data;
};

export const orderService = {
  // 🧾 Create order FROM CART (backend already has items)
  async createOrder(shippingAddress: ShippingAddress) {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ shippingAddress }),
    });

    return handleResponse(res);
  },
};