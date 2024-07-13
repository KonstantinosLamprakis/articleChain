const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT;

require('dotenv').config();

const routes = require('./src/routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

require('./src/routes')(app);

app.listen(port, () => {
  console.log(`Server started at: http://localhost:$(port)`);
});
