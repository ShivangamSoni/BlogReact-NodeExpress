const app = require("./express/app");

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server Started`);
});
