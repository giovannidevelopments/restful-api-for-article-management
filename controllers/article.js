const fs = require('fs');
const path = require('path');
const { validateArticle } = require('../helpers/validate');
const Article = require('../models/Article');

const create = (req, res) => {

    // Collect the parameters per post to save
    let parameters = req.body;

    // validate data
    try {
        validateArticle(parameters);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Missing data to send"
        });
    }

    // Create the object to save
    const article = new Article(parameters);

    // Save the article to the database
    article.save()
        .then(savedArticle => {
            return res.status(200).json({
                status: "success",
                article: savedArticle,
                message: "Article created successfully!!"
            });
        })
        .catch(error => {
            return res.status(400).json({
                status: "error",
                message: "The article has not been saved"
            });
        });

}

const list = async (req, res) => {
    try {
        let articles;

        if (req.params.last) {
            articles = await Article.find({}).sort({ date: -1 }).limit(3);
        } else {
            articles = await Article.find({}).sort({ date: -1 });
        }

        if (!articles || articles.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No articles found"
            });
        }
        return res.status(200).json({
            status: "success",
            counter: articles.length,
            articles
        });
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "No articles found"
        });
    }
};

const one = (req, res) => {
    // Collect an id by url
    let id = req.params.id;
    // Search article
    Article.findById(id)
        .then(article => {
            if (!article) {
                return res.status(400).json({
                    status: "error",
                    message: "No article found"
                });
            }
            return res.status(200).json({
                status: "success",
                article
            });
        })
        .catch(error => {
            return res.status(400).json({
                status: "error",
                message: "No article found"
            });
        });

}

const deleteArticle = async (req, res) => {
    try {
        let articleId = req.params.id;

        const deletedArticle = await Article.findOneAndDelete({ _id: articleId });

        if (!deletedArticle) {
            return res.status(500).json({
                status: "error",
                message: "Error when deleting the article"
            });
        }

        return res.status(200).json({
            status: "success",
            article: deletedArticle,
            message: "Article deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error when deleting the article"
        });
    }
};

const edit = (req, res) => {
    // Collect id of the article to edit
    let articleId = req.params.id;

    // Collect body data
    let parameters = req.body;

    // Validate data
    try {
        validateArticle(parameters);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Missing data to send"
        });
    }


    // Search and update article
    Article.findOneAndUpdate({ _id: articleId }, parameters, { new: true })
        .then(updatedArticle => {
            if (!updatedArticle) {
                return res.status(404).json({
                    status: "error",
                    message: "Article not found"
                });
            }
            return res.status(200).json({
                status: "success",
                article: updatedArticle
            });
        })
        .catch(error => {
            return res.status(500).json({
                status: "error",
                message: "Error updating"
            });
        });

}

const upload = (req, res) => {

    // Configure multer
    // Collect the uploaded image file
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "error",
            message: "Invalid request"
        })
    }
    // File name
    let file = req.file.originalname;
    // File extension
    let file_split = file.split('\.');
    let extension = file_split[1];
    // Check correct extension
    if (extension != 'png' && extension != 'jpg' &&
        extension != 'jpeg' && extension != 'gif') {
        // Delete file and give response
        fs.unlink(rq.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                message: "Invalid image"
            });
        })
    } else {
        // Collect id of the article to edit
        let articleId = req.params.id;

        // Search and update article
        Article.findOneAndUpdate({ _id: articleId }, { image: req.file.filename }, { new: true })
            .then(updatedArticle => {
                if (!updatedArticle) {
                    return res.status(404).json({
                        status: "error",
                        message: "Article not found"
                    });
                }
                return res.status(200).json({
                    status: "success",
                    article: updatedArticle,
                    file: req.file
                });
            })
            .catch(error => {
                return res.status(500).json({
                    status: "error",
                    message: "Error updating"
                });
            });

    }
}

const image = (req, res) => {
    let image = req.params.image;
    let physical_route = './img/articles/' + image;

    fs.stat(physical_route, (error, exists) => {
        if (exists) {
            return res.sendFile(path.resolve(physical_route));
        } else {
            return res.status(404).json({
                status: "error",
                message: "The image does not exist"
            });
        }
    })
}

const search = async (req, res) => {
    try {
        // Get the search string
        let search = req.params.text;
        // Find OR
        const foundArticles = await Article.find({
            "$or": [
                { "title": { "$regex": search, "$options": "i" } },
                { "content": { "$regex": search, "$options": "i" } },
            ]
        }).sort({ date: -1 }).exec();

        if (!foundArticles || foundArticles.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "No articles found"
            });
        }

        return res.status(200).json({
            status: "success",
            foundArticles
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "An error occurred while searching articles"
        });
    }
}


module.exports = {
    create,
    list,
    one,
    deleteArticle,
    edit,
    upload,
    image,
    search
}
