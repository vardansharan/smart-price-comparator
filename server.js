const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Error:", err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  rating: Number,
  reviews: Number,
  category: String,
  image: String,
  description: String
});

const Product = mongoose.model("Product", productSchema);

// GET all products
app.get("/api/products", async (req, res) => {
  const { q, minPrice, maxPrice, category } = req.query;

  let filter = {};

  if (q) {
    filter.name = { $regex: q, $options: "i" };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(filter);
  res.json(products);
});

// Add product (admin)
app.post("/api/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

app.get("/", (req, res) => {
  res.send("Real E-commerce Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});