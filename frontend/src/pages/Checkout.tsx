import { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  Tag,
  Truck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";

import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

import { formatINR } from "@/lib/currency";
import { calcDiscount, findCoupon } from "@/lib/coupons";
import { generateOrderId, saveOrder } from "@/lib/orders";

import type { Coupon } from "@/types";


//  Razorpay TYPES (NO ANY)
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
}

declare global {
  interface Window {
    Razorpay: new (options: unknown) => RazorpayInstance;
  }
}

type Status = "idle" | "processing" | "success";

const Checkout = () => {
  const { items, total, clear, refreshCart } = useCart();
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>("idle");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  // redirect if empty
  useEffect(() => {
    if (items.length === 0 && status === "idle") {
      navigate("/cart");
    }
  }, [items, status, navigate]);

  const shipping = 0;
  const discount = coupon ? calcDiscount(coupon, total) : 0;
  const taxable = Math.max(0, total - discount);
  const tax = Math.round(taxable * 0.08);
  const grandTotal = taxable + tax + shipping;

  // 🔥 Load Razorpay script
  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  //  APPLY COUPON (FIXED ASYNC)
  const applyCoupon = async () => {
    const found = await findCoupon(couponInput);

    if (!found) return toast.error("Invalid coupon");

    if (found.minSubtotal && total < found.minSubtotal) {
      return toast.error(`Min subtotal ${formatINR(found.minSubtotal)}`);
    }

    setCoupon(found);
    toast.success(`Applied ${found.code}`);
  };

  // SUBMIT PAYMENT
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;

    setStatus("processing");

    try {
      const ok = await loadRazorpay();
      if (!ok) {
        toast.error("Razorpay failed to load");
        setStatus("idle");
        return;
      }

      // create order from backend
      const res = await fetch("http://localhost:8000/api/v1/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: grandTotal }),
      });

      const order = await res.json();

      const options = {
        key: "rzp_test_sFo2Yh6BgEltFf",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        name: "E-Shop",
        description: "Order Payment",

        //  NO ANY HERE
        handler: async (response: RazorpayResponse) => {
          await fetch("http://localhost:8000/api/v1/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(response),
          });

          //  SAVE ORDER (FULL TYPE SAFE)
          await saveOrder({
            id: generateOrderId(),
            date: new Date().toISOString(),
            items,
            total: grandTotal,
            status: "processing",
            couponCode: coupon?.code,
            discount,
          });

          await refreshCart();
          clear();

          setStatus("success");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
      setStatus("idle");
    }
  };

  return (
    <PageTransition>
      <section className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h1 className="text-2xl font-semibold">Order Confirmed</h1>
              <Button onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-6 max-w-lg mx-auto"
            >
              <h1 className="text-2xl font-semibold">Checkout</h1>

              {/* COUPON */}
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon"
                  className="flex-1 px-3 py-2 border rounded"
                />
                <Button type="button" onClick={applyCoupon}>
                  Apply
                </Button>
              </div>

              {/* TOTAL */}
              <div className="space-y-1 text-sm">
                <p>Subtotal: {formatINR(total)}</p>
                {discount > 0 && <p>Discount: -{formatINR(discount)}</p>}
                <p>Tax: {formatINR(tax)}</p>
                <p className="font-semibold text-lg">
                  Total: {formatINR(grandTotal)}
                </p>
              </div>

              <Button type="submit" disabled={status === "processing"}>
                {status === "processing" ? "Processing..." : "Pay Now"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
};

export default Checkout;