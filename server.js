const app = require("./src/server");
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server chạy port ${PORT}`);
});
