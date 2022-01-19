const express = require("express");
const cors = require("cors");
const app = express();
const BlogsRouter = require("./Routers/blogs");
const UserRouter = require("./Routers/user");

app.use(express.json());
app.use(cors());
app.use("/api/v1/blogs", BlogsRouter);
app.use("/api/v1/user", UserRouter);

module.exports = app;
