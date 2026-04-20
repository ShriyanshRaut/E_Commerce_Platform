import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { formatINR } from "@/lib/currency";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product);
    toast.success(`Added to cart`, { description: product.name });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30" />
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-card shadow-card backdrop-blur-xl transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-elegant">
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <motion.img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute left-3 top-3">
            <span className="rounded-full bg-background/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-md">
              {product.category}
            </span>
          </div>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold tracking-tight">{product.name}</h3>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {product.description}
              </p>
            </div>
            <p className="shrink-0 text-base font-semibold">{formatINR(product.price)}</p>
          </div>

          <Button
            onClick={handleAdd}
            variant="hero"
            size="sm"
            className="w-full"
          >
            <Plus className="h-4 w-4" />
            Add to cart
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
