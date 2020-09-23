const router = require('express').Router();
const Person = require('./models/person');


router.get('/', (req, res, next) => {
  Person.find()
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      next(error);
    });
});
router.get('/:id', (req, res, next) => {
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
router.delete('/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        return res.status(204).end();
      } else {
        return res
          .status(404)
          .send({ error: 'Person\'s information is no longer on the server' });
      }
    })
    .catch((error) => next(error));
});
router.post('/', (req, res, next) => {
  const body = req.body;

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
router.put('/:id', (req, res, next) => {
  const body = req.body;

  const person = {
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
  })
    .then((updatedPerson) => {
      if (updatedPerson) {
        return res.json(updatedPerson);
      } else {
        return res
          .status(404)
          .send({ error: 'Person\'s information is no longer on the server' });
      }
    })
    .catch((error) => next(error));
});

module.exports = router;
