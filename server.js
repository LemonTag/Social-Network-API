const express = require('express');
const routes = require('./routes');
const db = require('./config/connection')

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(routes)

// Start the server
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
})
