const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const { format } = require('date-fns');
const { uploadFile } = require('./upload');
require('dotenv').config();

function configureMulter() {
	const formattedDate = format(new Date(), 'dd-MM-yyyy_hh-mm-ss');
	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, 'uploads/');
		},
		filename: (req, file, cb) => {
			cb(null, formattedDate + path.extname(file.originalname));
		}
	});

	const fileFilter = (req, file, cb) => {
		const allowedTypes = /jpeg|jpg|png|gif/;
		const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
		const mimetype = allowedTypes.test(file.mimetype);

		if (extname && mimetype) {
			cb(null, true);
		} else {
			cb(new Error('Only images are allowed!'), false);
		}
	};

	return multer({ storage, fileFilter });
}

const deleteFile = (filePath) => {
	// Use path.resolve() to get an absolute path (optional)
	const absolutePath = path.resolve(filePath);

	// Use fs.unlink() to delete the file
	fs.unlink(absolutePath, (err) => {
		if (err) {
			console.error('Error deleting file:', err);
			return;
		}
		console.log('File deleted successfully');
	});
};

module.exports = (app) => {
    const upload = configureMulter();

	app.post('/submit-article', upload.fields([{ name: 'image', maxCount: 1 }]), async (req, res) => {
		
	});
};
