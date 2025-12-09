import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(10);
  const [category, setCategory] = useState("electronics");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const categories = ["electronics", "fashion", "shoes", "accessories", "lifestyle"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("stock", stock);
      formData.append("category", category);
      if (image) formData.append("image", image);

      await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/"); // Redirect to Home/Admin Dashboard
    } catch (err) {
      console.error(err);
      alert("Failed to add product. Make sure all fields are correct.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20, maxWidth: 500 }}>
      <h2>Add Product</h2>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required style={inputStyle} />
      <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} required style={inputStyle} />

      <label style={{ fontWeight: "600" }}>Category</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        ))}
      </select>

      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={inputStyle} />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={inputStyle} />

      <button type="submit" style={{ backgroundColor: "#16a34a", color: "white", padding: 8, border: "none", borderRadius: 4 }}>Add</button>
    </form>
  );
}

const inputStyle = { display: "block", margin: "10px 0", width: "100%", padding: 8 };
