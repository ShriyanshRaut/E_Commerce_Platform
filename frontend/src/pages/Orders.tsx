import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ArrowRight, Receipt } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/lib/orders";
import { formatINR } from "@/lib/currency";
import type { Order } from "@/types";

const statusStyles: Record<string, string> = {
  processing: "bg-primary/15 text-primary-glow border-primary/30",
  shipped: "bg-accent/15 text-accent-foreground border-accent/30",
  delivered: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders(); // 🔥 FIX: await backend
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <PageTransition>
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Order history
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your past purchases and reorder favorites.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-white/5 bg-gradient-card p-10 text-center shadow-card">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/5">
              <Receipt className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="mt-5 text-lg font-semibold">No orders yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Once you place an order, it'll show up here.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-6 w-full">
              <Link to="/">
                Start shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-3xl border border-white/5 bg-gradient-card p-6 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5">
                      <Package className="h-5 w-5 text-primary-glow" />
                    </span>
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                        statusStyles[order.status] || ""
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-lg font-semibold">
                      {formatINR(order.total)}
                    </span>
                  </div>
                </div>

                <ul className="mt-4 space-y-3">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty {item.quantity} · {item.category}
                        </p>
                      </div>
                      <p className="text-sm">
                        {formatINR(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>

                {order.couponCode && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-glow">
                    Coupon {order.couponCode} · −
                    {formatINR(order.discount || 0)}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  );
};

export default Orders;