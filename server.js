const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Debug check
console.log("MONGO_URI exists?", process.env.MONGO_URI ? "YES" : "NO");

// Correct MongoDB connection (NO old options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err.message));

app.get("/", (req, res) => {
  res.send("Server Working & Mongo Connected");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});