'use strict';

const express = require('express');
require('dotenv').config();
const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');
const override = require('method-override');
const { request } = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);

client.on('error', (error) => console.error(error));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(override('_method'));
app.use(cors());

app.set('view engine', 'ejs');

// app.get('/test', (req, res) => {
//   res.render('pages/index');
// });

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM tasks';
  client.query(sql).then((data) => {
    res.render('./pages/index', { results: data.rows });
  });
});

app.get('/tasks/:task_id', (req, res) => {
  const sql = 'SELECT * FROM tasks WHERE id=$1;';
  let values = [req.params.task_id];
  client.query(sql, values).then((data) => {
    res.render('pages/detail-view', { task: data.rows[0] });
    // console.log(data.rows[0]);
  });
});

app.get('/add', (req, res) => {
  res.render('pages/add-view');
});

app.post('/add', (req, res) => {
  // console.log(req.body);
  const data = req.body;
  const sql =
    'INSERT INTO tasks(title, description, category, contact, status) VALUES($1, $2, $3, $4, $5);';
  const values = [
    data.title,
    data.description,
    data.category,
    data.contact,
    data.status,
  ];
  client.query(sql, values).then(res.redirect('/'));
});

app.get('*', (req, res) => {
  res.status(404).send('This route does exist');
});

client.connect().then(
  app.listen(PORT, () => {
    console.log('Listeneing on', PORT);
  })
);
