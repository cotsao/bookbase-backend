const router = require("express").Router();
const db = require("../models");

//index route --> returns index of all lists
router.get("/", async (req, res) => {
  try {
    const lists = await db.List.find({});
    res.json(lists);
  } catch (err) {
    console.log(err);
    res.json({ msg: "Something went wrong!" });
  }
});

module.exports = router;