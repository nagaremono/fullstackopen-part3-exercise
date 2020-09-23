require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');
const router = require('./controllers');
const utils = require('./utils');

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body);
});

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.use('/api/persons', router);

app.get('/info', (req, res, next) => {
  Person.countDocuments()
    .then((count) => {
      const info = `Phonebook has information for ${count} people`;
      const date = new Date();

      res.send(`
      <div>
        <h1>${info}</h1>
        <p>${date}</p>
      </div>
    `);
    })
    .catch((error) => next(error));
});

app.use(utils.unknownEndpoint);

app.use(utils.errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
