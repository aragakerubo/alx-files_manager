// Importing required modules
import express from 'express';
import routes from './routes/index';

// Create an instance of Express
const app = express();

// Set the port from the environment or default to 5000
const PORT = process.env.PORT || 5000;

// Load all routes from routes/index.js
app.use('/', routes);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
