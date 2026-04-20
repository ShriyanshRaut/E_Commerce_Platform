import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productService } from "@/services/api";
import type { Product } from "@/types";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    productService.getProducts().then((data) => {
      const found = data.find((p) => p.id === id);
      setProduct(found || null);
    });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-64 rounded-lg"
      />
      <h1 className="text-2xl mt-4">{product.name}</h1>
      <p className="text-muted-foreground">{product.description}</p>
      <p className="text-lg font-bold mt-2">₹{product.price}</p>
    </div>
  );
};

export default ProductDetails;