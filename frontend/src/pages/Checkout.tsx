import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { formatINR } from "@/lib/currency";
import { orderService } from "@/services/order";

type Status = "idle" | "processing" | "success";

const Checkout = () => {
  const { items, total, clear, refreshCart } = useCart();
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (items.length === 0 && status === "idle") {
      navigate("/cart", { replace: true });
    }
  }, [items.length, status, navigate]);

  const shippingCost = 0;
  const tax = Math.round(total * 0.08);
  const grandTotal = total + shippingCost + tax;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "idle") return;

    const formData = new FormData(e.currentTarget);

    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const postalCode = formData.get("zip") as string;
    const country = formData.get("country") as string;

    if (!address || !city || !postalCode || !country) {
      toast.error("Please fill all shipping details");
      return;
    }

    setStatus("processing");

    try {
      // ✅ FIXED PAYLOAD
      await orderService.createOrder({
          address,
          city,
          postalCode,
          country,
      });

      await refreshCart();
      setStatus("success");

      // 🎉 CONFETTI
      const end = Date.now() + 800;
      const colors = ["#a855f7", "#6366f1", "#3b82f6", "#ec4899"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 65,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 65,
          origin: { x: 1, y: 0.7 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      toast.success("Order placed successfully 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed");
      setStatus("idle");
    }
  };

  const handleDone = () => {
    clear();
    navigate("/", { replace: true });
  };

  if (items.length === 0 && status !== "success") {
    return <p className="p-6">Your cart is empty</p>;
  }

  return (
    <PageTransition>
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-md rounded-3xl border border-white/5 bg-gradient-card p-10 text-center shadow-elegant"
            >
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary-glow" />
              <h1 className="mt-6 text-2xl font-semibold">Order confirmed</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your order is on its way 🚚
              </p>

              <Button className="mt-6 w-full" onClick={handleDone}>
                Continue shopping
              </Button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="grid gap-8 lg:grid-cols-[1fr_400px]"
            >
              {/* LEFT SIDE */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/5 bg-gradient-card p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Shipping details</h2>

                  <input
                    name="address"
                    placeholder="Address"
                    required
                    className="w-full p-3 bg-muted rounded"
                  />
                  <input
                    name="city"
                    placeholder="City"
                    required
                    className="w-full p-3 bg-muted rounded"
                  />
                  <input
                    name="zip"
                    placeholder="Postal Code"
                    required
                    className="w-full p-3 bg-muted rounded"
                  />
                  <input
                    name="country"
                    placeholder="Country"
                    required
                    className="w-full p-3 bg-muted rounded"
                  />
                </div>

                {/* PAYMENT UI (like Lovable) */}
                <div className="rounded-3xl border border-white/5 bg-gradient-card p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Payment</h2>

                  <input
                    placeholder="Card number"
                    className="w-full p-3 bg-muted rounded"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      placeholder="MM / YY"
                      className="p-3 bg-muted rounded"
                    />
                    <input
                      placeholder="CVC"
                      className="p-3 bg-muted rounded"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <aside>
                <div className="rounded-3xl border border-white/5 bg-gradient-card p-6">
                  <h2 className="mb-4 font-semibold">Order summary</h2>

                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>{formatINR(total)}</span>
                  </div>

                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>

                  <div className="flex justify-between mb-4">
                    <span>Tax</span>
                    <span>{formatINR(tax)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg mb-6">
                    <span>Total</span>
                    <span>{formatINR(grandTotal)}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={status === "processing"}
                  >
                    {status === "processing"
                      ? "Processing..."
                      : `Pay ${formatINR(grandTotal)}`}
                  </Button>
                </div>
              </aside>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
};

export default Checkout;