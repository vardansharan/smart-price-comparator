const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   MongoDB Connection
================================ */

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Error:", err));


/* ================================
   API Route
================================ */

app.get("/api/search", async (req, res) => {
  const query = req.query.q || "";
  const maxPrice = req.query.maxPrice;

  try {
    const response = await axios.get("https://fakestoreapi.com/products", {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    let products = response.data;

    // Normalize structure
    products = products.map(p => ({
      name: p.title,
      price: p.price,
      rating: p.rating?.rate || 4,
      reviews: p.rating?.count || 100
    }));

    // Search filter
    if (query) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Price filter
    if (maxPrice) {
      products = products.filter(p => p.price <= maxPrice);
    }

    // Value score calculation
    const result = products.map(p => ({
      ...p,
      valueScore:
        (p.rating * Math.log(p.reviews + 1)) / p.price
    }));

    res.json(result.sort((a, b) => b.valueScore - a.valueScore));

  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).json({ error: "API fetch failed" });
  }
});


/* ================================
   Health Check (Render)
================================ */

app.get("/healthz", (req, res) => {
  res.send("OK");
});


/* ================================
   Start Server
================================ */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});