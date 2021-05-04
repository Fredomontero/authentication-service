const express = require('express');
const mongoose = require('mongoose');
const URL = 'mongodb://127.0.0.1:27017/testdbs';
const PORT = 4501;

//Express App
const app = express();

//Connect to DB ussing mongoose connect method
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
  app.listen(PORT, () => {
    console.log(`Connected to DB, Server running at http://localhost:${PORT}`);
  });
})
.catch(error => console.log('Error: ', error));

app.get('/', (req, res) => {
  res.send('Hello World!');
});
