const express = require("express");
const cors = require("cors");
const app = express();
const BlogsRouter = require("./Routers/blogs");
const UserRouter = require("./Routers/user");
const { CORS_Config } = require("./CONSTANTS");

app.use(cors(CORS_Config));
app.use(express.json());
app.use("/api/v1/blogs", BlogsRouter);
app.use("/api/v1/user", UserRouter);

module.exports = app;
