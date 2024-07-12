
const setupRoutes = require('./src/routes/routes');
const express = require('express');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

function configureApp(app) {
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, 'views'));
}

function init() {
	setupRoutes(app);
	configureApp(app);

	app.listen(port, () => {
		console.log(`Server running at http://localhost:${port}/`);
	});
}

init();