const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const fs = require('fs');

require('dotenv').config();

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

app.get('/contact', (req, res) => {
  res.render('layout', { content: 'contact_submit' });
});

app.get('/article', (req, res) => {
  res.render('layout', { content: 'article_submit' });
});

app.post('/submit-article', upload.single('image'), (req, res) => {
  const { headline, short_text, content, humanCheck, humanCheckAnswer } = req.body;
  const image = req.file;

  console.log('Form data:', { headline, short_text, content, image, humanCheckAnswer, humanCheck });

  if (parseInt(humanCheck) !== parseInt(humanCheckAnswer)) {
    res.render('layout', { content: 'failed_submit', message: 'You need to verify that you are a human by doing the math. Try again.' });
    return;
  }

  res.send('Form submitted successfully!');
});

app.post('/contact-submit', upload.array('files'), (req, res) => {
  const { Name, Email, Message, humanCheck, humanCheckAnswer } = req.body;
  const files = req.files;

  if (parseInt(humanCheck) !== parseInt(humanCheckAnswer)) {
    return res.status(400).send('Human verification failed.');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: Email,
    to: process.env.CONTACT_RECEIVER,
    subject: 'Contact Form Submission',
    text: `Name: ${Name}\nEmail: ${Email}\nMessage: ${Message}`,
    attachments: files.map(file => {
      return {
        filename: file.originalname,
        path: file.path
      };
    })
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email.');
    }
    console.log('done.3');
    try {
      Promise.all(files.map(file => {
        return new Promise((resolve, reject) => {
          fs.unlink(file.path, err => {
            if (err) {
              console.error('Error deleting file:', err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      })).then((onResolved) => {
        res.render('layout', { content: 'article_submit' });
      },
        (onRejected) => {
          res.render('layout', { content: 'article_submit' });
        })
    } catch (err) {
      res.status(500).send('Error deleting uploaded files.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server started at: http://localhost:${port}`);
});
