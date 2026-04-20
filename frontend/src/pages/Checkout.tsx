import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { formatINR } from "@/lib/currency";

type Status = "idle" | "processing" | "success";

const Checkout = () => {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [focused, setFocused] = useState<string | null>(null);

  // Redirect to cart if empty (and we're not in success state)
  useEffect(() => {
    if (items.length === 0 && status === "idle") {
      navigate("/cart", { replace: true });
    }
  }, [items.length, status, navigate]);

  const shipping = 0;
  const tax = Math.round(total * 0.08);
  const grandTotal = total + shipping + tax;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("processing");

    setTimeout(() => {
      setStatus("success");
      // Confetti burst
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
      toast.success("Payment successful", { description: "Your order is on its way." });
    }, 1800);
  };

  const handleDone = () => {
    clear();
    navigate("/", { replace: true });
  };

  const inputClass = (id: string) =>
    `h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60`;

  const fieldWrap = (id: string, extra = "") =>
    `group flex items-center gap-3 rounded-2xl border bg-white/5 px-4 transition-all duration-300 ${
      focused === id
        ? "border-primary/60 bg-white/[0.07] shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]"
        : "border-white/10"
    } ${extra}`;

  return (
    <PageTransition>
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="mx-auto max-w-md rounded-3xl border border-white/5 bg-gradient-card p-10 text-center shadow-elegant"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-primary shadow-glow"
              >
                <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
              </motion.div>
              <h1 className="mt-6 text-2xl font-semibold tracking-tight">Order confirmed</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks for your purchase. A confirmation has been sent to your email.
              </p>
              <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-left text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Order total</span>
                  <span className="font-semibold">{formatINR(grandTotal)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated delivery</span>
                  <span>3–5 days</span>
                </div>
              </div>
              <Button variant="hero" size="lg" className="mt-6 w-full" onClick={handleDone}>
                Continue shopping
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to bag
                  </Link>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                    Checkout
                  </h1>
                </div>
                <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
                  <Lock className="h-3.5 w-3.5" />
                  Secure encrypted payment
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid gap-8 lg:grid-cols-[1fr_400px]"
              >
                {/* LEFT — forms */}
                <div className="space-y-6">
                  {/* Shipping */}
                  <div className="rounded-3xl border border-white/5 bg-gradient-card p-6 shadow-card">
                    <div className="mb-5 flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/5">
                        <Truck className="h-4 w-4 text-primary-glow" />
                      </span>
                      <h2 className="text-base font-semibold">Shipping details</h2>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      {[
                        { id: "fname", label: "First name", placeholder: "Jane" },
                        { id: "lname", label: "Last name", placeholder: "Doe" },
                      ].map((f) => (
                        <div key={f.id}>
                          <label className="mb-1.5 block text-xs text-muted-foreground">
                            {f.label}
                          </label>
                          <div className={fieldWrap(f.id)}>
                            <input
                              required
                              placeholder={f.placeholder}
                              onFocus={() => setFocused(f.id)}
                              onBlur={() => setFocused(null)}
                              className={inputClass(f.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3">
                      <label className="mb-1.5 block text-xs text-muted-foreground">
                        Email
                      </label>
                      <div className={fieldWrap("email")}>
                        <input
                          required
                          type="email"
                          placeholder="you@example.com"
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          className={inputClass("email")}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="mb-1.5 block text-xs text-muted-foreground">
                        Address
                      </label>
                      <div className={fieldWrap("addr")}>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <input
                          required
                          placeholder="123 Market Street"
                          onFocus={() => setFocused("addr")}
                          onBlur={() => setFocused(null)}
                          className={inputClass("addr")}
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      {[
                        { id: "city", label: "City", placeholder: "San Francisco" },
                        { id: "zip", label: "ZIP", placeholder: "94103" },
                        { id: "country", label: "Country", placeholder: "United States" },
                      ].map((f) => (
                        <div key={f.id}>
                          <label className="mb-1.5 block text-xs text-muted-foreground">
                            {f.label}
                          </label>
                          <div className={fieldWrap(f.id)}>
                            <input
                              required
                              placeholder={f.placeholder}
                              onFocus={() => setFocused(f.id)}
                              onBlur={() => setFocused(null)}
                              className={inputClass(f.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="rounded-3xl border border-white/5 bg-gradient-card p-6 shadow-card">
                    <div className="mb-5 flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/5">
                        <CreditCard className="h-4 w-4 text-primary-glow" />
                      </span>
                      <h2 className="text-base font-semibold">Payment</h2>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs text-muted-foreground">
                        Card number
                      </label>
                      <div className={fieldWrap("card")}>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <input
                          required
                          inputMode="numeric"
                          placeholder="4242 4242 4242 4242"
                          onFocus={() => setFocused("card")}
                          onBlur={() => setFocused(null)}
                          className={inputClass("card")}
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs text-muted-foreground">
                          Expiry
                        </label>
                        <div className={fieldWrap("exp")}>
                          <input
                            required
                            placeholder="MM / YY"
                            onFocus={() => setFocused("exp")}
                            onBlur={() => setFocused(null)}
                            className={inputClass("exp")}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-muted-foreground">
                          CVC
                        </label>
                        <div className={fieldWrap("cvc")}>
                          <input
                            required
                            inputMode="numeric"
                            placeholder="123"
                            onFocus={() => setFocused("cvc")}
                            onBlur={() => setFocused(null)}
                            className={inputClass("cvc")}
                          />
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      This is a demo — no real charges are made.
                    </p>
                  </div>
                </div>

                {/* RIGHT — order summary */}
                <aside className="lg:sticky lg:top-24 lg:self-start">
                  <div className="rounded-3xl border border-white/5 bg-gradient-card p-6 shadow-card">
                    <div className="mb-4 flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/5">
                        <Package className="h-4 w-4 text-primary-glow" />
                      </span>
                      <h2 className="text-base font-semibold">Order summary</h2>
                    </div>

                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                            <img
                              src={item.image}
                              alt={item.name}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-primary px-1 text-[10px] font-semibold text-primary-foreground">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                          <p className="text-sm font-medium">
                            {formatINR(item.price * item.quantity)}
                          </p>
                        </li>
                      ))}
                    </ul>

                    <div className="my-5 h-px bg-white/10" />

                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Subtotal</dt>
                        <dd>{formatINR(total)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Shipping</dt>
                        <dd className="text-primary-glow">Free</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Tax</dt>
                        <dd>{formatINR(tax)}</dd>
                      </div>
                    </dl>

                    <div className="my-5 h-px bg-white/10" />

                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-2xl font-semibold">{formatINR(grandTotal)}</span>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="mt-6 w-full"
                      disabled={status === "processing"}
                    >
                      {status === "processing" ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          Pay {formatINR(grandTotal)}
                        </>
                      )}
                    </Button>
                  </div>
                </aside>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageTransition>
  );
};

export default Checkout;
