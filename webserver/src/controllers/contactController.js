const transporter = require('../config/nodemailer');
const fs = require('fs');

const submitContactForm = (req, res) => {
    const { Name, Email, Message, humanCheck, humanCheckAnswer } = req.body;
    const files = req.files;

    if (parseInt(humanCheck) !== parseInt(humanCheckAnswer)) {
        res.render('layout', { content: 'failure', message: 'You need to verify that you are a human by doing the math. Try again.' });
        return;
    }

    const mailOptions = {
        from: Email,
        to: process.env.CONTACT_RECEIVER,
        subject: 'Contact Form Submission',
        text: `Name: ${Name}\nEmail: ${Email}\nMessage: ${Message}`,
        attachments: files.map(file => ({
            filename: file.originalname,
            path: file.path
        }))
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.render('layout', { content: 'failure', message: 'Error sending email.' });
            return ;
        }
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
            }))
            res.render('layout', { content: 'success', message: 'Thank you for your message. We will contact you soon.' })
        } catch (err) {
            console.log("Error deleting uploaded files on contact submission.");
        }
    });
};

module.exports = { submitContactForm };
