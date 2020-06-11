const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const mongo_uri = require('./app/config/config').MONGO_URI;

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use(cors());

//routes
app.use('/api', require('./app/routes/routes'));

//db connection
mongoose
  .connect(mongo_uri, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to the database 😎");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

const PORT = process.env.PORT || 8001;

app.listen(PORT, function() {
  console.log("app listening on port " + PORT);
});

module.exports = app;
