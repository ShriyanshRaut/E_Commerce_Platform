import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ProductSkeleton from "@/components/ProductSkeleton";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/api";
import type { Product } from "@/types";
import { toast } from "sonner";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌊 Smooth scroll function (premium feel)
  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const startY = window.scrollY;
    const targetY = el.getBoundingClientRect().top + startY - 16;
    const distance = targetY - startY;
    const duration = 1400;

    let startTime: number | null = null;

    const ease = (t: number) =>
      t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, startY + distance * ease(progress));

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    let mounted = true;

    productService
      .getProducts()
      .then((data) => {
        if (mounted) setProducts(data);
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />

        <div className="container mx-auto px-4 py-20 md:px-6 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-primary-glow" />
              New season · drop 04
            </span>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              Designed for the
              <br />
              <span className="text-gradient">extraordinary</span>.
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              A curated edit of premium essentials. Crafted with intent, built to last,
              and shipped worldwide.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button variant="hero" size="lg" asChild>
                <a
                  href="#shop"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo("shop");
                  }}
                >
                  Shop the collection
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>

              <Button variant="glass" size="lg" asChild>
                <a
                  href="#shop"
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScrollTo("shop");
                  }}
                >
                  Explore lookbook
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="container mx-auto px-4 pb-24 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Featured
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {loading ? "Loading…" : `${products.length} products`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            : products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;