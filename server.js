const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   Health Check Route
========================= */
app.get("/healthz", (req, res) => {
  res.status(200).send("OK");
});

/* =========================
   Product Search API
========================= */
app.get("/api/search", async (req, res) => {
  const query = req.query.q || "";
  const maxPrice = req.query.maxPrice
    ? parseFloat(req.query.maxPrice)
    : null;

  try {
    // Using dummyjson (Render safe)
    const response = await axios.get(
      "https://dummyjson.com/products?limit=100"
    );

    let products = response.data.products;

    // Normalize structure
    products = products.map(p => ({
      name: p.title,
      price: p.price,
      rating: p.rating || 4,
      reviews: p.stock || 100
    }));

    // Search filter
    if (query) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Price filter
    if (maxPrice !== null) {
      products = products.filter(p => p.price <= maxPrice);
    }

    // Value Score Calculation
    const result = products.map(p => ({
      ...p,
      valueScore:
        (p.rating * Math.log(p.reviews + 1)) / p.price
    }));

    // Sort by best value
    result.sort((a, b) => b.valueScore - a.valueScore);

    res.json(result);

  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).json({ error: "API fetch failed" });
  }
});

/* =========================
   Server Start
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});