const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('layout', { content: 'index' });
});

app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
});
