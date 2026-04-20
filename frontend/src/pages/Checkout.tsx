import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { formatINR } from "@/lib/currency";

// 🔥 Razorpay types (THIS FIXES YOUR ERROR)
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name?: string;
  description?: string;
  handler: (response: RazorpayResponse) => void;
  theme?: {
    color: string;
  };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const Checkout = () => {
  const { items, total, clear, refreshCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const tax = Math.round(total * 0.08);
  const grandTotal = total + tax;

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  // 🔥 Load Razorpay script
  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ok = await loadRazorpay();

      if (!ok) {
        toast.error("Razorpay SDK failed");
        setLoading(false);
        return;
      }

      // 🔥 CREATE ORDER
      const res = await fetch(
        "http://localhost:8000/api/v1/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount: grandTotal }),
        }
      );

      const order = await res.json();

      const options: RazorpayOptions = {
        key: "rzp_test_Sfo2Yh6BgEltFf",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        name: "E-Shop",
        description: "Order Payment",

        handler: async (response) => {
          // 🔐 VERIFY PAYMENT
          await fetch("http://localhost:8000/api/v1/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(response),
          });

          await refreshCart();
          clear();

          // 🎉 confetti
          const end = Date.now() + 800;

          (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 } });
            confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 } });

            if (Date.now() < end) requestAnimationFrame(frame);
          })();

          toast.success("Payment successful 🎉");
          navigate("/");
        },

        theme: {
          color: "#6366f1",
        },
      };

      // ✅ NO MORE "any" ERROR HERE
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
        {/* LEFT */}
        <div className="space-y-4">
          <input name="address" placeholder="Address" required className="w-full p-3 bg-muted rounded" />
          <input name="city" placeholder="City" required className="w-full p-3 bg-muted rounded" />
          <input name="zip" placeholder="ZIP Code" required className="w-full p-3 bg-muted rounded" />
          <input name="country" placeholder="Country" required className="w-full p-3 bg-muted rounded" />
        </div>

        {/* RIGHT */}
        <div className="p-6 rounded-xl border bg-card">
          <h2 className="mb-4 font-semibold">Summary</h2>

          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.name}</span>
              <span>{formatINR(item.price * item.quantity)}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg mt-4">
            <span>Total</span>
            <span>{formatINR(grandTotal)}</span>
          </div>

          <Button className="w-full mt-6" type="submit" disabled={loading}>
            {loading ? "Processing..." : `Pay ${formatINR(grandTotal)}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;