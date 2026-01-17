const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// 🧱 Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  subtitle: String,
  shortDesc: String,
  category: String,
  img: String,
  images: [String]
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);

// ✅ API: Get all products
app.get("/api/products", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// ✅ API: Add product (Admin)
app.post("/api/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json({ success: true, product });
});

// ✅ API: Delete product
app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Rayunics Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
