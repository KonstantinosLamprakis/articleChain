
function setupRoutes(app) {

	app.get('/', (req, res) => {
		res.render('/index');
	});

	require('../filecoin/filecoin')(app);


}

module.exports = setupRoutes;
