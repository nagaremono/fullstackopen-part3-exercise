const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide password as argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];

const mongoUrl = `mongodb+srv://fsopen:${password}@cluster0.fjbhi.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find().then((persons) => {
    console.log('phonebook:');
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
