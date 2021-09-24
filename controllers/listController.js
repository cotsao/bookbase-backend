const router = require("express").Router();
const db = require("../models");

//index route --> returns index of one user's lists
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

//post route --> create a List for specified user
router.post("/", async (req, res) => {
  const newList = await db.List.create(req.body.newList);

  await db.User.findOneAndUpdate(
    { auth0Id: req.body.auth0ID },
    { $addToSet: { userLists: newList } },
    { new: true }
  );
  res.json({ msg: "whoops" });
});

//add Books to list

router.post("/:id/books", async (req, res) => {
  const id = req.body.auth0ID;
  await db.List.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { books: req.body.books } },
    { new: true }
  );
  try {
    const user = await db.User.findOne({ auth0ID: id });
    const listToUpdateIndex = user.userLists.findIndex(
      (list) => list._id.toString() === req.params.id
    );
    let updatedList = user.userLists[listToUpdateIndex].books;
    if (updatedList.includes(req.body.books) === false) {
      updatedList.push(req.body.books);
    }

    user.userLists[listToUpdateIndex].books = updatedList;
    await db.User.findOneAndUpdate(
      { auth0Id: id },
      { $set: { userLists: user.userLists } },
      { new: true }
    );
    res.json("book added");
  } catch (error) {
    console.log(error);
  }

  /*  db.List.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { books: req.body.books } },
    { new: true },
    (err, updatedList) => {
      if (err) return console.log(err);
      res.json(updatedList);
    }
  ); */
});

//update route --> update a List
router.put("/:id", async (req, res) => {
  const id = req.body.auth0ID;
  const toUpdate = req.body.updatedList;
  try {
    const updatedList = await db.List.findByIdAndUpdate(
      req.params.id,
      { $set: toUpdate },
      { new: true }
    );

    await db.User.findOneAndUpdate(
      { auth0Id: id },
      { $set: { userLists: toUpdate } },
      { new: true }
    );
    res.json(updatedList)
  } catch (error) {
    console.log(error);
  }

  /* db.List.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true },
    (err, updatedList) => {
      if (err) return console.log(err);

      res.json(updatedList);
    }
  ); */
});

//delete route --> delete a List
router.delete("/:id", async (req, res) => {
  const id = req.body.auth0ID;
  console.log(id);
  try {
    await db.List.findByIdAndDelete(req.params.id);

    const user = await db.User.findOne({ auth0Id: id });
    const deletedListIndex = user.userLists.findIndex(
      (list) => list._id.toString() === req.params.id
    );

    user.userLists.splice(deletedListIndex, 1);
    await db.User.findOneAndUpdate(
      { auth0Id: id },
      { $set: { userLists: user.userLists } },
      { new: true }
    );
    res.json("delete successful");
  } catch (error) {
    console.log(error);
  }
});
/* ------------------------------- delete book ------------------------------ */
router.delete("/:listId/works/:bookId", async (req, res) => {
  const id = req.body.auth0ID;
  try {
    const listToUpdate = await db.List.findById(req.params.listId);
    const bookIndex = listToUpdate.books.findIndex(
      (book) => book === `/works/${req.params.bookId}`
    );
    listToUpdate.books.splice(bookIndex, 1);
    console.log(listToUpdate);
    const finalUpdatedList = await db.List.findByIdAndUpdate(
      req.params.listId,
      { $set: { books: listToUpdate.books } },
      { new: true }
    );
    await db.User.findOneAndUpdate(
      { auth0Id: id },
      { $set: { userLists: listToUpdate } },
      { new: true }
    );
    res.json(finalUpdatedList);
  } catch (error) {
    console.log(error);
  }

  /*   db.List.findById(req.params.listId, (err, foundList) => {
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
  }); */
});
module.exports = router;
