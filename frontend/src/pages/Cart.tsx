import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/currency";

const Cart = () => {
  const { items, total, count, loading, setQuantity, removeItem, clear } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <PageTransition>
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Your bag
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Loading..."
              : count > 0
              ? `${count} item${count === 1 ? "" : "s"}`
              : "Nothing here yet"}
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center text-muted-foreground">Loading cart...</div>
        ) : items.length === 0 ? (

          /* EMPTY STATE */
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

            {/* ITEMS */}
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      x: -40,
                      height: 0,
                      marginTop: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4 rounded-2xl border border-white/5 bg-gradient-card p-3 shadow-card md:p-4"
                  >

                    {/* IMAGE */}
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary/40 md:h-28 md:w-28">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* DETAILS + CONTROLS */}
                    <div className="flex flex-1 flex-col justify-between">

                      {/* TOP */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {item.category}
                          </p>
                          <h3 className="mt-0.5 font-medium">
                            {item.name}
                          </h3>
                        </div>

                        <p className="font-semibold">
                          {formatINR(item.price * item.quantity)}
                        </p>
                      </div>

                      {/* CONTROLS */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">

                          {/* ➖ */}
                          <button
                            onClick={async () => {
                              if (item.quantity > 1) {
                                await setQuantity(item.id, "decrease");
                              } else {
                                await removeItem(item.id);
                              }
                            }}
                            aria-label="Decrease quantity"
                            title="Decrease quantity"
                            className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>

                          {/* COUNT */}
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          {/* ➕ */}
                          <button
                            onClick={async () => {
                              await setQuantity(item.id, "increase");
                            }}
                            aria-label="Increase quantity"
                            title="Increase quantity"
                            className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={async () => await removeItem(item.id)}
                          className="text-xs text-muted-foreground hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>

                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {/* SUMMARY */}
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-white/5 bg-gradient-card p-6 shadow-card">
                <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Summary
                </h2>

                <div className="mt-4 flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(total)}</span>
                </div>

                <div className="my-5 h-px bg-white/10" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="mt-6 w-full"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>

                <button
                  onClick={clear}
                  className="mt-3 w-full text-xs text-muted-foreground hover:text-white"
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