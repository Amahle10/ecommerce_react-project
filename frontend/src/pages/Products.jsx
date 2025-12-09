import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
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
  const [priceSort, setPriceSort] = useState("none"); // none, low, high
  const [priceRange, setPriceRange] = useState([0, 0]); // dynamic min & max

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
          const prices = res.data.map(p => p.price);
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
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filtering & sorting
  useEffect(() => {
    let list = [...products];

    // Search filter
    if (searchTerm.trim()) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (category !== "all") {
      list = list.filter(p => p.category === category);
    }

    // Price range filter
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Price sort
    if (priceSort === "low") list.sort((a, b) => a.price - b.price);
    if (priceSort === "high") list.sort((a, b) => b.price - a.price);

    setFiltered(list);
  }, [searchTerm, category, priceSort, priceRange, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProductId(product._id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const handleClearFilters = () => {
    setCategory("all");
    setPriceSort("none");
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }
  };

  if (loading) return <p style={styles.loading}>Loading products...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Collection</h2>

      {/* Filters */}
      <div style={styles.filterRow}>
        <select value={category} onChange={e => setCategory(e.target.value)} style={styles.dropdown}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>

        <select value={priceSort} onChange={e => setPriceSort(e.target.value)} style={styles.dropdown}>
          <option value="none">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>

        <div style={styles.priceRange}>
          <label>Price: R{priceRange[0]} - R{priceRange[1]}</label>
          <input
            type="range"
            min={Math.min(...products.map(p => p.price))}
            max={Math.max(...products.map(p => p.price))}
            value={priceRange[0]}
            onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
          />
          <input
            type="range"
            min={Math.min(...products.map(p => p.price))}
            max={Math.max(...products.map(p => p.price))}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
          />
        </div>

        <button onClick={handleClearFilters} style={styles.clearBtn}>Clear Filters</button>
      </div>

      {searchTerm && (
        <p style={styles.searchTag}>Showing results for: <strong>{searchTerm}</strong></p>
      )}

      {/* Product Grid */}
      <div style={styles.grid}>
        {filtered.length === 0 ? (
          <p style={styles.noResults}>No products found.</p>
        ) : (
          filtered.map(product => (
            <div key={product._id} style={styles.card}>
              {product.image ? (
                <img src={`http://localhost:5000${product.image}`} alt={product.name} style={styles.image} />
              ) : (
                <div style={styles.placeholder}>No Image</div>
              )}
              <h3>{product.name}</h3>
              <p style={styles.price}>R{product.price}</p>
              <p style={styles.category}>Category: {product.category || "Uncategorized"}</p>
              <p style={styles.description}>{product.description}</p>
              <button onClick={() => handleAddToCart(product)} style={styles.btn}>Add to Cart</button>

              {addedProductId === product._id && (
                <div style={styles.popup}>✅ Added!</div>
              )}
            </div>
          ))
        )}
      </div>

      <style>
        {`
          @keyframes fadeSlide {
            0% { opacity: 0; transform: translateY(-10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  page: { padding: "20px" },
  heading: { textAlign: "center", fontSize: "2.5rem", fontWeight: "800", marginBottom: "2rem" },
  loading: { fontSize: "1.2rem", textAlign: "center", marginTop: "2rem" },
  error: { fontSize: "1.2rem", textAlign: "center", marginTop: "2rem", color: "red" },

  filterRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" },
  dropdown: { padding: "10px 16px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem" },
  clearBtn: { padding: "10px 16px", borderRadius: "6px", border: "none", backgroundColor: "#f87171", color: "#fff", cursor: "pointer" },
  priceRange: { display: "flex", flexDirection: "column", gap: "4px", minWidth: "200px" },
  searchTag: { fontSize: "1rem", color: "#555" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" },
  card: { border: "1px solid #ddd", padding: "12px", borderRadius: "6px", position: "relative" },
  image: { width: "100%", height: 200, objectFit: "cover", borderRadius: 6, marginBottom: 8 },
  placeholder: { width: "100%", height: 200, backgroundColor: "#eee", borderRadius: 6, marginBottom: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  price: { fontWeight: 600 },
  category: { fontStyle: "italic", color: "#555" },
  description: { fontSize: 14, marginBottom: 8 },
  btn: { backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "8px", borderRadius: 4, cursor: "pointer", fontWeight: 600 },
  popup: { position: "absolute", top: "10px", right: "10px", background: "#fff6e5", color: "#333", padding: "6px 12px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600", boxShadow: "0 6px 16px rgba(0,0,0,0.2)", pointerEvents: "none", animation: "fadeSlide 2s ease forwards", zIndex: 10 },
  noResults: { textAlign: "center", marginTop: "2rem", fontSize: "1.2rem", color: "#555" },
};
