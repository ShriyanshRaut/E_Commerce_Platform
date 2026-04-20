import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/currency";

const Cart = () => {
  const { items, total, count, setQuantity, removeItem, clear } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <PageTransition>
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Your bag</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {count > 0 ? `${count} item${count === 1 ? "" : "s"}` : "Nothing here yet"}
          </p>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md rounded-3xl border border-white/5 bg-gradient-card p-10 text-center shadow-card"
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary shadow-glow">
              <ShoppingBag className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Your bag is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Discover our latest pieces and find something you love.
            </p>
            <Button variant="hero" className="mt-6" asChild>
              <Link to="/">
                Start shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="flex gap-4 rounded-2xl border border-white/5 bg-gradient-card p-3 shadow-card md:p-4"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary/40 md:h-28 md:w-28">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {item.category}
                          </p>
                          <h3 className="mt-0.5 font-medium">{item.name}</h3>
                        </div>
                        <p className="font-semibold">{formatINR(item.price * item.quantity)}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                          <button
                            onClick={() => setQuantity(item.id, item.quantity - 1)}
                            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(item.id, item.quantity + 1)}
                            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                            aria-label="Increase"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-white/5 bg-gradient-card p-6 shadow-card">
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Summary
                </h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{formatINR(total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="text-primary-glow">Free</dd>
                  </div>
                </dl>
                <div className="my-5 h-px bg-white/10" />
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <motion.span
                    key={total}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-semibold"
                  >
                    {formatINR(total)}
                  </motion.span>
                </div>
                <Button variant="hero" size="lg" className="mt-6 w-full" onClick={handleCheckout}>
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <button
                  onClick={clear}
                  className="mt-3 w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear bag
                </button>
              </div>
            </aside>
          </div>
        )}
      </section>
    </PageTransition>
  );
};

export default Cart;
