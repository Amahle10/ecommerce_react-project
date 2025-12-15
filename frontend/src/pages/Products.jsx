import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api/axios";
import { CartContext } from "../context/CartContext";

export default function Products() {
  const { addToCart } = useContext(CartContext);
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedProductId, setAddedProductId] = useState(null);

  const [category, setCategory] = useState("all");
  const [priceSort, setPriceSort] = useState("none");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [selections, setSelections] = useState({});

  const searchTerm = new URLSearchParams(location.search).get("search") || "";

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get("/products");
        setProducts(res.data);
        setFiltered(res.data);

        if (res.data.length > 0) {
          const prices = res.data.map((p) => p.price);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } catch {
        setError("❌ Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Dynamic categories
  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  // Filtering & sorting
  useEffect(() => {
    let list = [...products];

    // Search filter
    if (searchTerm) list = list.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    if (category !== "all") list = list.filter((p) => p.category === category);

    // Price filter
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Price sort
    if (priceSort === "low") list.sort((a, b) => a.price - b.price);
    if (priceSort === "high") list.sort((a, b) => b.price - a.price);

    setFiltered(list);
  }, [searchTerm, category, priceSort, priceRange, products]);

  // Handle variant & quantity selection
  const handleOptionChange = (productId, field, value) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  // Add to cart
  const handleAddToCart = (product) => {
    const selected = selections[product._id] || { quantity: 1 };

    // Check variant if applicable
    if (product.variants?.length > 0 && !selected.variant) {
      alert("Please select a variant before adding to cart");
      return;
    }

    addToCart({ ...product, ...selected });
    setAddedProductId(product._id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const handleClearFilters = () => {
    setCategory("all");
    setPriceSort("none");
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading products...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" }}>Collection</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem", justifyContent: "center" }}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>

        <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)}>
          <option value="none">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

        <button onClick={handleClearFilters}>Clear Filters</button>
      </div>

      {searchTerm && <p>Showing results for: <strong>{searchTerm}</strong></p>}

      {/* Product Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
        {filtered.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filtered.map((product) => {
            const selected = selections[product._id] || { quantity: 1 };
            return (
              <div key={product._id} style={{ border: "1px solid #ddd", padding: "12px", borderRadius: "6px", position: "relative" }}>
                {product.image ? (
                  <img src={`http://localhost:5000${product.image}`} alt={product.name} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 6, marginBottom: 8 }} />
                ) : (
                  <div style={{ width: "100%", height: 200, backgroundColor: "#eee", borderRadius: 6, marginBottom: 8, display: "flex", justifyContent: "center", alignItems: "center" }}>No Image</div>
                )}

                <h3>{product.name}</h3>
                <p style={{ fontWeight: 600 }}>R{product.price}</p>
                <p style={{ fontStyle: "italic", color: "#555" }}>Category: {product.category || "Uncategorized"}</p>
                <p>{product.description}</p>

                {/* Variant selector */}
                {product.variants?.length > 0 && (
                  <select
                    value={selected.variant || ""}
                    onChange={(e) => handleOptionChange(product._id, "variant", e.target.value)}
                  >
                    <option value="">Select Variant</option>
                    {product.variants.map((v, i) => (
                      <option key={i} value={v.name}>{v.name} - R{v.price || product.price}</option>
                    ))}
                  </select>
                )}

                {/* Quantity */}
                <div style={{ marginTop: "8px" }}>
                  <label>Qty:</label>
                  <input
                    type="number"
                    min={1}
                    value={selected.quantity || 1}
                    onChange={(e) => handleOptionChange(product._id, "quantity", Number(e.target.value))}
                    style={{ width: "50px", marginLeft: "6px" }}
                  />
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{ marginTop: "8px", width: "100%", padding: "8px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
                >
                  Add to Cart
                </button>

                {addedProductId === product._id && (
                  <div style={{ position: "absolute", top: "10px", right: "10px", background: "#fff6e5", color: "#333", padding: "6px 12px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600", boxShadow: "0 6px 16px rgba(0,0,0,0.2)" }}>
                    ✅ Added!
                  </div>
                )}

                <Link to={`/products/${product._id}`}>
                  <button style={{ marginTop: "6px", width: "100%", padding: "6px", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>
                    View Product
                  </button>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
