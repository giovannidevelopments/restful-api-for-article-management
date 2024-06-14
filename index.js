const { connection } = require("./database/connection");
const express = require('express');
const cors = require('cors');

// Initialize the application

console.log('Node app started');

// Connect to database

connection();

// Create node server
const app = express();
const port = 3900;

// Configure CORS
app.use(cors());

// Convert body to JS object
app.use(express.json()); // Receive data with content-type app/json
app.use(express.urlencoded({ extended: true })); // form-urlencoded

// Create routes
const article_routes = require("./routes/article");

// Loading the routes
app.use("/api", article_routes)

// Create server and listen to HTTP requests
app.listen(port, () => {
    console.log('Server running on port 3900');
});

