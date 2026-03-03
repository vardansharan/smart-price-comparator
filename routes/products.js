const express = require("express");
const router = express.Router();
const { searchProducts } = require("../services/productService");

router.get("/search", (req, res) => {
  const query = req.query.q || "";
  const maxPrice = req.query.maxPrice;

  const results = searchProducts(query, maxPrice);
  res.json(results);
});

module.exports = router;