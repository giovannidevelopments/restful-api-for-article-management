const express = require('express');
const multer = require('multer');
const ArticleController = require("../controllers/article");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './img/articles/');
    },

    filename: (req, file, cb) => {
        cb(null, "article" + Date.now() + file.originalname)
    }
});

const uploads = multer({ storage: storage })

// Useful routes

router.post('/create', ArticleController.create);

router.get('/articles/:last?', ArticleController.list);

router.get('/article/:id', ArticleController.one);

router.delete("/article/:id", ArticleController.deleteArticle);

router.put('/article/:id', ArticleController.edit);

router.post('/upload-image/:id', [uploads.single("file")], ArticleController.upload);

router.get('/image/:image', ArticleController.image);

router.get('/search/:text', ArticleController.search);

module.exports = router;