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
    stock: 1, // default stock
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Use admin endpoint to get full data including real stock
        const res = await API.get(`/products/admin/${id}`);
        setProduct({
          ...res.data,
          stock: res.data.stock ?? 1 // fallback to 1 if undefined
        });
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

  const handleImageChange = (e) => {
    setProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock || 1); // fallback to 1
      if (product.image instanceof File) {
        formData.append("image", product.image);
      }

      await API.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
        <img
          src={`http://localhost:5000${product.image}`}
          alt={product.name}
          style={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            borderRadius: 6,
            marginBottom: 12,
            border: "1px solid #ddd",
          }}
        />
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            min={0}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>Stock</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            min={0}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: 4 }}>Image</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: 10,
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Update Product
        </button>
      </form>
    </div>
  );
}
