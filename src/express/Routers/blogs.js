const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");
const verifyJWT = require("../Middleware/verifyJWT");
const bodyRequired = require("../Middleware/bodyRequired");
const express = require("express");
const router = express.Router();
const getLatestByUser = require("../Utils/getLatestByUser");

// Blogs Data JSON
let BLOGS = require("../../Models/Blogs.json");
const BlogsFilePath = path.resolve(__dirname, "../", "../", "Models", "Blogs.json");

/**
 * @method GET
 * @listens /api/v1/blogs
 * @description Retrieve All Blogs
 */
router.get("/", (req, res) => {
  const blogs = BLOGS.map((blog) => ({ title: blog.title, id: blog.id, category: blog.category, creationTime: blog.creationTime, content: blog.content.slice(0, 3) }));
  res.json({ success: true, data: { blogs } });
});

/**
 * @method POST
 * @listens /api/v1/blogs
 * @description Create a New Blog Post
 * @argument Object blog
 */
router.post("/", bodyRequired, verifyJWT, async (req, res) => {
  const newBlog = req.body;
  newBlog.id = uuid();
  BLOGS.push(newBlog);

  try {
    await fs.writeFile(BlogsFilePath, JSON.stringify(BLOGS));
    res.json({ success: true, blogId: newBlog.id });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * @method GET
 * @listens /api/v1/blogs/latest
 * @description Retrieve latest Posts related to LoggedIn User
 */
router.get("/latest", verifyJWT, (req, res) => {
  const { userId } = req.payload;
  const latest = getLatestByUser(userId, BLOGS);
  res.json({ success: true, data: latest });
});

/**
 * @method GET
 * @listens /api/v1/blogs/:id
 * @description Retrieve Blog using Blog ID
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const blog = BLOGS.filter((blog) => blog.id == id)[0];

  if (!blog) {
    res.status(404).json({ success: false, message: "Blog Not Found" });
    return;
  }

  res.json({ success: true, data: { blog } });
});

/**
 * @method GET
 * @listens /api/v1/blogs/category/:category
 * @description Retrieve
 */
router.get("/category/:category", (req, res) => {
  const { category } = req.params;

  const blogs = BLOGS.filter((blog) => blog.category.toLowerCase() === category);

  res.json({ success: true, data: { blogs } });
});

/**
 * @method DELETE
 * @listens /api/v1/blogs/:id
 * @description Delete Blog using ID. Should happen only if user Authenticated
 */
router.delete("/:id", verifyJWT, (req, res) => {
  const { id } = req.params;
  // TODO: Check if Blog belongs to the User
  const newBlogs = BLOGS.filter((blog) => blog.id !== id);
  BLOGS.length = 0;
  BLOGS.splice(0, 0, ...newBlogs);

  res.json({ success: true, data: BLOGS });
});

/**
 * @method PUT
 * @listens /api/v1/blogs/vote/:id
 * @description Increase or Decrease the Up-Vote Count
 */
router.put("/vote/:blogId", verifyJWT, bodyRequired, async (req, res) => {
  const { blogId } = req.params;
  const { count } = req.body;

  const blog = BLOGS.filter((blog) => blog.id == blogId)[0];
  blog.upVotes = count === 1 ? blog.upVotes + 1 : blog.upVotes - 1;
  BLOGS = BLOGS.filter((blog) => blog.id != blogId);
  BLOGS.push(blog);

  try {
    await fs.writeFile(BlogsFilePath, JSON.stringify(BLOGS));
    res.json({ success: true, message: "Updated" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/**
 * @method GET
 * @listens /api/v1/blogs/latest/:id
 * @description Retrieve latest Posts related to User ID
 */
router.get("/latest/:userId", (req, res) => {
  const { userId } = req.params;
  const latest = getLatestByUser(userId, BLOGS);
  res.json({ success: true, data: latest });
});

module.exports = router;
