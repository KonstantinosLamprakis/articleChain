const fs = require('fs');

const submitArticle = (req, res) => {
  const { headline, short_text, content, humanCheck, humanCheckAnswer } = req.body;
  const image = req.file;

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
    const sanitizeTitle = headline.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    const date = new Date().toISOString().slice(0, 10);

    const filename = `${sanitizeTitle}_${date}.json`;
    const formData = {
        headline,
        image: {
            originalname: image.originalname,
            mimetype: image.mimetype,
            size: image.size,
            buffer: image.buffer.toString('base64')
        },
        short_text,
        content
    };

    const jsonContent = JSON.stringify(formData, null, 2);


    fs.writeFile(filename, jsonContent, (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
            return res.status(500).send('Internal server error');
        }
    });


  res.render('layout', { content: 'success', message: 'Article submited successfully.' });
  });
};

module.exports = { submitArticle };
