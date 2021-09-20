const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookbase';

const configOptions = {
  useNewUrlParser: true,
  /* useCreateIndex: true, */
  useUnifiedTopology: true,
  /* useFindAndModify: false, */
};

// Connects to MongoDB
mongoose.connect(connectionString, configOptions)
  .then(() => console.log('MongoDB successfully connected...'))
  .catch((err) => console.log(`MongoDB connection error: ${err}`));

//export to controller
module.exports = {
  List: require('./List'),
};
