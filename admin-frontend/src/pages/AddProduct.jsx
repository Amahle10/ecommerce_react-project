import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(10);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null); // File
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use FormData to send image file
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

      navigate("/"); // Go back to product list
    } catch (err) {
      console.error(err);
      alert("Failed to add product. Make sure all fields are correct.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20, maxWidth: 500 }}>
      <h2>Add Product</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />

      <input
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ display: "block", margin: "10px 0", width: "100%" }}
      />

      <button
        type="submit"
        style={{
          backgroundColor: "#16a34a",
          color: "white",
          padding: 8,
          border: "none",
          borderRadius: 4,
        }}
      >
        Add
      </button>
    </form>
  );
}
