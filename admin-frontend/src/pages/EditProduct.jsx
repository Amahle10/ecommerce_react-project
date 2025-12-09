import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function EditProduct() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: 1,
    category: "electronics",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["electronics", "fashion", "shoes", "accessories", "lifestyle"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/admin/${id}`);
        setProduct({ ...res.data, stock: res.data.stock ?? 1 });
      } catch (err) {
        setError("❌ Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => setProduct((prev) => ({ ...prev, image: e.target.files[0] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock || 1);
      formData.append("category", product.category);
      if (product.image instanceof File) formData.append("image", product.image);

      await API.put(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/"); 
    } catch (err) {
      setError("❌ Failed to update product");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Edit Product</h2>

      {product.image && typeof product.image === "string" && (
        <img src={`http://localhost:5000${product.image}`} alt={product.name} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 6, marginBottom: 12, border: "1px solid #ddd" }} />
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Name" required style={inputStyle} />
        <textarea name="description" value={product.description} onChange={handleChange} placeholder="Description" required style={inputStyle} />
        <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" min={0} required style={inputStyle} />
        <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="Stock" min={0} required style={inputStyle} />

        <label>Category</label>
        <select name="category" value={product.category} onChange={handleChange} style={inputStyle}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>

        <input type="file" onChange={handleImageChange} />

        <button type="submit" style={{ backgroundColor: "#3b82f6", color: "white", padding: 10, borderRadius: 6, border: "none", cursor: "pointer", fontWeight: "bold" }}>
          Update Product
        </button>
      </form>
    </div>
  );
}

const inputStyle = { width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" };
