const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body);
});

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
];

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id);

  const person = persons.find((person) => personId === person.id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const personId = Number(req.params.id);

  persons = persons.filter((person) => person.id !== personId);

  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (body.name.length === 0 || body.number.length === 0) {
    return res.status(400).json({
      error: 'Missing fields',
    });
  }

  const samePerson = persons.find((person) => person.name === body.name);

  if (samePerson) {
    return res.status(400).json({
      error: 'Name must be unique',
    });
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const newPerson = {
    id: getRandomInt(5, 999999999),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

app.get('/info', (req, res) => {
  const info = `Phonebook has info for ${persons.length} people`;
  const date = new Date();

  res.send(`
    <div>
      <h1>${info}</h1>
      <p>${date}</p>
    </div>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
