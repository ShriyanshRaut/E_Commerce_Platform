import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, ShoppingBag, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/orders", label: "Orders" }, // 🔥 restored
  { to: "/cart", label: "Cart" },
  { to: "/login", label: "Login" },
];

export default function Navbar() {
  const { count } = useCart();
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="glass-strong border-b border-white/5">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          
          {/* LOGO */}
          <Link to="/" className="group flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary shadow-glow transition-transform duration-300 group-hover:scale-110">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              E<span className="text-gradient">·</span>Shop
            </span>
          </Link>

          {/* NAV LINKS */}
          <nav className="flex items-center gap-1 md:gap-2">
            {links.map((l) => {
              const active = location.pathname === l.to;

              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {/* CART COUNT */}
                  {l.label === "Cart" && count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-primary px-1 text-[10px] font-semibold text-primary-foreground shadow-glow"
                    >
                      {count}
                    </motion.span>
                  )}

                  {/* ICON + TEXT */}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {l.label === "Cart" && (
                      <ShoppingBag className="h-3.5 w-3.5" />
                    )}
                    {l.label === "Orders" && (
                      <Receipt className="h-3.5 w-3.5" />
                    )}
                    {l.label}
                  </span>

                  {/* ACTIVE ANIMATION */}
                  <AnimatePresence>
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-0 rounded-full bg-white/5 ring-1 ring-white/10"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}