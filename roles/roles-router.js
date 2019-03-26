const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/roles.db3'
  }
};

const db = knex(knexConfig);

router.get('/', async (req, res) => {
  // get the roles from the database
  try {
    const roles = await db('roles'); // all the records from the table
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/:id', async (req, res) => {
  // retrieve a role by id
  try {
    const role = await db('roles')
      .where({ id: req.params.id })
      .first();
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/', async (req, res) => {
  // add a role to the database
  try {
    const [id] = await db('roles').insert(req.body);
    const role = await db('roles')
      .where({ id })
      .first();
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/:id', (req, res) => {
  // update roles
  db('roles')
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json(error);
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.delete('/:id', (req, res) => {
  // remove roles (inactivate the role)
  db('roles')
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Record not found' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
