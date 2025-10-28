import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { CartContext } from "../context/CartContext"; // 👈 import cart context

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext); // 👈 access addToCart function

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError("❌ Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-3 gap-5">
        {products.map((product) => (
          <div key={product._id} className="border p-3 rounded">
            <h3 className="font-semibold">{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            {/* ✅ Add to Cart Button */}
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
