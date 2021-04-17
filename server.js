'use strict';

const express = require('express');
require('dotenv').config();
const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');
const override = require('method-override');

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

app.get('/test', (req, res) => {
  res.render('pages/index');
});

client.connect().then(
  app.listen(PORT, () => {
    console.log('Listeneing on', PORT);
  })
);
