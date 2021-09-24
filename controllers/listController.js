const router = require("express").Router();
const db = require("../models");

//index route --> return data for all cities
router.get("/", async (req, res) => {
  try {
    const user = await db.User.findOne({ auth0Id: req.user.sub });
    const list = user.userLists;

    res.json(list);
  } catch (err) {
    console.log(err);
    res.json({ msg: "Something went wrong!" });
  }
});

//show route --> data for one List
router.get("/:id", (req, res) => {
  db.List.findById(req.params.id, (err, foundList) => {
    if (err) return console.log(err);
    res.json(foundList);
  });
});

//post route --> create a List
router.post("/", async (req, res) => {
  console.log("you hit the post route");
  const newList = await db.List.create(req.body.newList);
  
  await db.User.findOneAndUpdate(
    { auth0Id: req.body.auth0ID },
    { $addToSet: { userLists: newList } },
    { new: true }
  );
  res.json({ msg: "whoops" });
  /* db.List.create(req.body, (err, createdList) => {
    if (err) return console.log(err);
    console.log(req.body);
    res.json(createdList);
  }); */
});

//add Books to list

router.post("/:id/books", (req, res) => {
  console.log(req.body);
  db.List.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { books: req.body.books } },
    { new: true },
    (err, updatedList) => {
      if (err) return console.log(err);
      res.json(updatedList);
    }
  );
});

//update route --> update a List
router.put("/:id", (req, res) => {
  db.List.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
    (err, updatedList) => {
      if (err) return console.log(err);

      res.json(updatedList);
    }
  );
});

//delete route --> delete a List
router.delete("/:id", async (req, res) => {
  
  const id = req.body.auth0ID
  console.log(id)
  try {
    /* await db.List.findByIdAndDelete(req.params.id);
    console.log(deletedlist) */
    const user = await db.User.findOne({ auth0Id: id });
    const deletedBookIndex = user.userLists.findIndex(
      (list) => (list._id.toString() === req.params.id)
    );
    await db.User.findOneAndUpdate(
      { auth0Id: id },
      { $set: { userLists: user.userLists.splice(deletedBookIndex, 1) } },
      { new: true }
    );
    res.json("delete successful");
  } catch (error) {
    console.log(error);
  }
});
/* ------------------------------- delete book ------------------------------ */
router.delete("/:listId/works/:bookId", (req, res) => {
  db.List.findById(req.params.listId, (err, foundList) => {
    if (err) return console.log(err);
    const bookIndex = foundList.books.findIndex(
      (book) => book === `/works/${req.params.bookId}`
    );
    foundList.books.splice(bookIndex, 1);
    db.List.findByIdAndUpdate(
      req.params.listId,
      { $set: { books: foundList.books } },
      { new: true },
      (err, updatedList) => {
        if (err) return console.log(err);
        res.json(updatedList);
      }
    );
  });
});
module.exports = router;
