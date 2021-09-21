const express = require("express");
const cors = require("cors");
const listController = require("./controllers/listController");

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/list", listController);

app.listen(port, () => {
  console.log(`Server is running on port localhost:${port}`);
});
