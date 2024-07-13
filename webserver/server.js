const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 3000;

require('dotenv').config();

const routes = require('./src/routes/index');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server started at: http://localhost:${port}`);
});
