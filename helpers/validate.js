const validator = require("validator");

const validateArticle = (parameters) => {
    let validate_title = !validator.isEmpty(parameters.title) &&
        validator.isLength(parameters.title, ({ min: 0, max: 15 }));
    let validate_content = !validator.isEmpty(parameters.content);

    if (!validate_title || !validate_content) {
        throw new Error("The information has not been validated!!");
    }
}

module.exports = {
    validateArticle
}