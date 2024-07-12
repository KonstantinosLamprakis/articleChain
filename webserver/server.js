const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('layout', { content: 'submit' });
});

app.post('/submit-form', upload.single('image'), (req, res) => {
    // Process form data
    const headline = req.body.headline;
    const shortText = req.body.short_text;
    const content = req.body.content;
    const image = req.file; // Uploaded file details
  
    // You can now process this data as per your application's requirements
    console.log('Form data:', { headline, shortText, content, image });
  
    // Respond to the client as needed
    res.send('Form submitted successfully!');
  });

app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`);
});
