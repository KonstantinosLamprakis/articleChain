const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const setupRoutes = require('./src/routes/routes');

const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static files serving
app.use(express.static(path.join(__dirname, 'public')));

setupRoutes();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
