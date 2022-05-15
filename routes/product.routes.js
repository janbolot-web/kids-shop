const { Router } = require("express");
const roleMiddleware = require("../middlewares/roleMiddleware");
const router = Router();
const Product = require("../models/Product");

router.post("/add", roleMiddleware("ADMIN"), async (req, res) => {
  try {
    const { title, imageUrl, price, color, description } = req.body;

    const product = new Product({ title, imageUrl, price, color, description });

    await product.save();

    res.json(product);
  } catch (e) {
    console.log(e);
  }
});

router.get("/", async (req, res) => {
  try {
    let { page, limit } = req.query;

    const totalCount = await Product.countDocuments();

    const products = await Product.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ _id: -1 });
    
    res.json({ products, totalCount });
  } catch (e) {
    console.log(e);
  }
});

router.get("/search", async (req, res) => {
  try {
    const searchName = req.query.search;
    let products = await Product.find();
    products = products.filter((product) => product.title.includes(searchName));
    return res.json(products);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: "Search error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({
      _id: id,
    });
    res.json(product);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
