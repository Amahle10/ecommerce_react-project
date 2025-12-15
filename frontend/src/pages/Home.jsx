import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HOMEAPI = axios.create({
  baseURL: import.meta.env.VITE_HOME_API_URL || "http://localhost:5000/",
});

// 👉 HERO BACKGROUND IMAGES
const heroImages = [
  "/hero/gettyimages-1171026448-612x612.jpg",
  "/hero/gettyimages-1922702237-612x612.jpg",
  "/hero/gettyimages-1922706523-612x612.jpg",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await HOMEAPI.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, []);

  // Background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* HERO SECTION */}
      <section
        style={{
          height: "100vh",
          backgroundImage: `url(${heroImages[currentImage]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          transition: "background-image 1s ease-in-out",
        }}
      >
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 900,
              letterSpacing: "-2px",
              marginBottom: "20px",
            }}
          >
            VYROX
          </h1>

          <p
            style={{
              fontSize: "1.1rem",
              letterSpacing: "3px",
              marginBottom: "50px",
              textTransform: "uppercase",
              opacity: 0.9,
            }}
          >
            Urban Streetwear & Lifestyle
          </p>

          <Link
            to="/products"
            style={{
              padding: "18px 48px",
              background: "#fff",
              color: "#000",
              borderRadius: "14px",
              fontWeight: 700,
              fontSize: "18px",
              textDecoration: "none",
            }}
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ padding: "80px 50px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "50px",
          }}
        >
          Featured Products
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "40px",
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                padding: "30px",
                border: "1px solid #000",
                borderRadius: "16px",
                background: "#fff",
              }}
            >
              {product.image ? (
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "360px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    marginBottom: "20px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "360px",
                    background: "#eee",
                    borderRadius: "16px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  No Image
                </div>
              )}

              <h3 style={{ fontSize: "24px", fontWeight: 700 }}>{product.name}</h3>
              <p style={{ fontSize: "20px", fontWeight: 600 }}>R{product.price}</p>

              <Link to={`/products/${product._id}`}>
                <button
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "14px",
                    background: "#000",
                    color: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  View Product
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
