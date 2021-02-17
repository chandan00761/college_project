let express = require('express');
let router = express.Router();
let multer = require("multer")
let path = require("path")
let parse = require("../parser/parser")

const storage = multer.diskStorage({
    // setting up disk storage for file upload
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // directory to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now())
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Excel file scrapper'});
});

/* POST file data. */
router.post('/', (req, res) => {
    let upload = multer({
        storage: storage,
    }).single('excel');

    upload(req, res, (err) => {
        if (!req.file) {
            return res.send('Please select an file to upload');
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        // parsing the uploaded file. Not asyncronous now as I haven't learnt that topic yet.
        let result = parse(req.file.path);
        res.send(result);
    });
});

module.exports = router;
