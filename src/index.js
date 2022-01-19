const app = require("./express/app");

const PORT = 80;
const HOST = "127.0.0.1";

app.listen(PORT, HOST, () => {
  console.log(`Server Started at:\n\thttp://${HOST}:${PORT}`);
});
