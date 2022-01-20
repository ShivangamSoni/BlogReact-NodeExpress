const express = require("express");
const cors = require("cors");
const app = express();
const BlogsRouter = require("./Routers/blogs");
const UserRouter = require("./Routers/user");

app.use(cors());
app.use(express.json());
app.use("/api/v1/blogs", BlogsRouter);
app.use("/api/v1/user", UserRouter);

app.get("/", (req, res) => {
  res.send("Server Up");
});

module.exports = app;
