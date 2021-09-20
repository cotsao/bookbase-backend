const db = require('./models/index.js')
db.List.deleteMany({},(err)=>{
    if(err)console.log(err)
})
console.log("deleted List")