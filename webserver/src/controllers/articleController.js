const fs = require('fs');

const submitArticle = (req, res) => {
  const { headline, short_text, content, humanCheck, humanCheckAnswer } = req.body;
  const image = req.file;

  console.log('Form data:', { headline, short_text, content, image, humanCheckAnswer, humanCheck });

  if (!image) {
    res.render('layout', { content: 'failure', message: 'Thumbnail image is mandatory' });
    return;
  }

  if (parseInt(humanCheck) !== parseInt(humanCheckAnswer)) {
    res.render('layout', { content: 'failure', message: 'You need to verify that you are a human by doing the math. Try again.' });
    return;
  }

  fs.unlink(image.path, (err) => {
    if (err) {
      console.error('Error deleting image file:', err);
      res.status(500).send('Error deleting image file.');
      return;
    }
  res.render('layout', { content: 'success', message: 'Article submited successfully.' });
  });
};

module.exports = { submitArticle };
