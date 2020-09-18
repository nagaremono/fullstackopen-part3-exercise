const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URI;

console.log('connecting to database...');

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => {
    console.log('connected to mongoDB');
  })
  .catch((error) => {
    console.log('error connecting to mongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
