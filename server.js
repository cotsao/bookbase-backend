const express = require("express");
const cors = require("cors");
require('dotenv').config()
const listController = require("./controllers/listController");
const authController = require("./controllers/authController")
const publicController = require('./controllers/publicController')
const jwtCheck = require('./middleware/jwtCheck')
const morgan = require('morgan')
const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use("/list",jwtCheck, listController);
app.use("/auth", authController)
app.use("/public",publicController)

app.listen(port, () => {
  console.log(`Server is running on port localhost:${port}`);
});
