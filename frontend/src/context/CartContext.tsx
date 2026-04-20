import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/types";
import { cartService } from "@/services/cart";

type State = { items: CartItem[] };

type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "optimisticAdd"; product: Product }
  | { type: "clear" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };

    case "optimisticAdd": {
      const existing = state.items.find((i) => i.id === action.product.id);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            id: action.product.id,
            name: action.product.name,
            price: action.product.price,
            image: action.product.image,
            category: action.product.category,
            description: action.product.description,
            quantity: 1,
          },
        ],
      };
    }

    case "clear":
      return { items: [] };

    default:
      return state;
  }
}

// BACKEND TYPES
interface BackendCartProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  description?: string;
}

interface BackendCartItem {
  productId: BackendCartProduct;
  quantity: number;
}

interface BackendCartResponse {
  data: {
    items: BackendCartItem[];
  };
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  loading: boolean;
  addItem: (product: Product) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  setQuantity: (id: string, type: "increase" | "decrease") => Promise<void>;
  refreshCart: () => Promise<void>;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res: BackendCartResponse = await cartService.getCart();

      const formatted: CartItem[] = res.data.items.map((item) => ({
        id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.images?.[0] || "",
        category: item.productId.category || "General",
        description: item.productId.description || "",
        quantity: item.quantity,
      }));

      dispatch({ type: "hydrate", items: formatted });
    } catch (err) {
      console.error("Failed to load cart", err);
      dispatch({ type: "hydrate", items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItem = async (product: Product) => {
    try {
      dispatch({ type: "optimisticAdd", product });
      await cartService.addToCart(product.id);
      await fetchCart();
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const removeItem = async (id: string) => {
    try {
      // ⚡ instant UI update
      dispatch({
        type: "hydrate",
        items: state.items.filter((item) => item.id !== id),
      });

      //  backend call
      await cartService.removeFromCart(id);
      await fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  //  CLEAN FIX
  const setQuantity = async (
    id: string,
    type: "increase" | "decrease"
  ) => {
    try {
      // ⚡ instant UI update first
      dispatch({
        type: "hydrate",
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  type === "increase"
                    ? item.quantity + 1
                    : Math.max(1, item.quantity - 1),
              }
            : item
        ),
      });

    // 🔥 then sync with backend
    await cartService.updateCartItem(id, type);
    await fetchCart();
  } catch (err) {
    console.error("Update failed", err);
  }
};

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((s, i) => s + i.quantity, 0);
    const total = state.items.reduce(
      (s, i) => s + i.quantity * i.price,
      0
    );

    return {
      items: state.items,
      count,
      total,
      loading,
      addItem,
      removeItem,
      setQuantity,
      refreshCart: fetchCart,
      clear: () => dispatch({ type: "clear" }),
    };
  }, [state.items, loading]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}