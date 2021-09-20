const router = require('express').Router();
const db = require('../models');

//index route --> return data for all cities
router.get('/', (req, res) => {
    db.List.find({}, (err, foundList) => {
        if (err) return console.log(err);
        res.json(foundList)
    })
})


//show route --> data for one List
router.get('/:id', (req,res) => {
    db.List.findById(req.params.id, (err,foundList) => {
        if (err) return console.log(err);
        res.json(foundList);
    });
})


//post route --> create a List
router.post('/', (req, res) => {
    console.log("you hit the post route")
    db.List.create(req.body, (err, createdList) => {
      if (err) return console.log(err);
      console.log(req.body)
      res.json(createdList);
    });
  });


//update route --> update a List
router.put('/:id', (req, res) => {
    db.List.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true},
      (err, updatedList) => { 
        if (err) return console.log(err);
        
        res.json(updatedList);
      });
  });



//delete route --> delete a List
router.delete('/:id', (req, res) => {
    db.List.findByIdAndDelete(req.params.id, (err, deletedList) => {
        if (err) return console.log(err);
        res.json("We deleted this")
    })
})

module.exports = router;