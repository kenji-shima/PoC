const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors({
    origin : "http://localhost:3000"
}));

/*fetch("http://localhost:3000/", {
    mode: 'no-cors'
}).then((data) => {
    console.log(data);
}).catch(error => {
    console.log(error);
});*/

// Add your routes and other server logic here

// Serve static files from the 'poc' directory
app.use(express.static(path.join(__dirname, '')));

// Handle requests to the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

