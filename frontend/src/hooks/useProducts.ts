import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/api";
import type { Product } from "@/types";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });
};