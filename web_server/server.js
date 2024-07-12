
const setupRoutes = require('./src/routes');

function init() {
	setupRoutes(app);

	app.listen(port, () => {
		console.log(`Server running at http://localhost:${port}/`);
	});
}

init();