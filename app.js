const express = require("express");
const path = require("node:path");
const router = require("./routes/router");

const app = express();
const PORT = 10000; // Render uses port 10000
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.set(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`Express app listening on port ${PORT}`);
});
