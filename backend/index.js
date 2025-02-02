require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Enable CORS for frontend access
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(bodyParser.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Define Post Schema
const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String, // Cloudinary image URL
  })
);

// Multer for handling image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 **Create a new post**
app.post("/api/posts", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description || !req.file) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    cloudinary.uploader
      .upload_stream({ folder: "blog-posts" }, async (error, result) => {
        if (error)
          return res.status(500).json({ message: "Error uploading image" });

        const newPost = new Post({
          title,
          description,
          imageUrl: result.secure_url,
        });
        await newPost.save();
        res
          .status(200)
          .json({ message: "Post added successfully!", post: newPost });
      })
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Error adding post", error });
  }
});

// 📌 **Get all posts**
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// 📌 **Update a post**
app.put("/api/posts/:id", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required!" });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// 📌 **Delete a post**
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
