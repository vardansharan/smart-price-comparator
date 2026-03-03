const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/search", async (req, res) => {
  const query = req.query.q || "";
  const maxPrice = req.query.maxPrice;

  try {
    const response = await axios.get("https://fakestoreapi.com/products");
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
    console.error(err.message);
    res.status(500).json({ error: "API fetch failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});