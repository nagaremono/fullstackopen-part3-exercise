require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

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

app.get('/api/persons', (req, res, next) => {
  Person.find()
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      next(error);
    });
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        return res.json(person);
      } else {
        return res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        return res.status(204).end();
      } else {
        return res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (body.name.length === 0 || body.number.length === 0) {
    return res.status(400).json({
      error: 'Missing fields',
    });
  }

  Person.findOne({ name: body.name }).then((samePerson) => {
    if (samePerson) {
      return res.status(400).send({
        error: 'name must be unique',
      });
    }

    const newPerson = new Person({
      name: body.name,
      number: body.number,
    });

    newPerson
      .save()
      .then((savedPerson) => {
        res.json(savedPerson);
      })
      .catch((error) => next(error));
  });
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        return res.json(updatedPerson);
      } else {
        return res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

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

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  res.status(500).send({ error: error.message });
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
