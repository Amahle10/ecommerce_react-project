import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import { CartContext } from "../context/CartContext";

export default function SingleProduct() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        setError("❌ Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.variants?.length > 0 && !variant) {
      alert("Please select a variant before adding to cart");
      return;
    }

    addToCart({
      ...product,
      quantity,
      variant,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading product...</p>;
  if (error)
    return <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</p>;
  if (!product)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Product not found</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <Link to="/products" style={{ display: "inline-block", marginBottom: "20px" }}>
        ⬅ Back to Products
      </Link>

      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
        {product.image && (
          <img
            src={`http://localhost:5000${product.image}`}
            alt={product.name}
            style={{
              width: "400px",
              height: "400px",
              objectFit: "cover",
              borderRadius: "12px",
            }}
          />
        )}

        <div style={{ maxWidth: "600px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>{product.name}</h1>
          <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>R{product.price}</p>
          <p style={{ marginBottom: "12px", color: "#555" }}>{product.description}</p>
          {product.category && (
            <p style={{ fontStyle: "italic", color: "#555" }}>
              Category: {product.category}
            </p>
          )}

          {/* Variant selector */}
          {product.variants?.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <label>Choose Option: </label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                style={{ marginLeft: "8px" }}
              >
                <option value="">Select</option>
                {product.variants.map((v, i) => (
                  <option key={i} value={v.name}>
                    {v.name} - R{v.price || product.price} ({v.stock} in stock)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity selector */}
          <div style={{ marginTop: "12px" }}>
            <label>Quantity: </label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: "60px", marginLeft: "8px" }}
            />
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            style={{
              marginTop: "16px",
              padding: "10px 20px",
              backgroundColor: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            🛒 Add to Cart
          </button>

          {added && (
            <p style={{ marginTop: "10px", color: "green", fontWeight: "600" }}>
              ✅ Added to cart!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}