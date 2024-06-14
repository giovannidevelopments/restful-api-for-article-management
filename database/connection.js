const mongoose = require("mongoose");

const connection = async () => {

    try {

        await mongoose.connect("mongodb://localhost:27017/my_blog");
        console.log("Successfully connected to the my_blog database.")
    } catch (error) {

        console.log(error);
        throw new Error("Could not connect to database");

    }

}

module.exports = {
    connection
}