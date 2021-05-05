const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const URL = 'mongodb://127.0.0.1:27017/testdbs';
const User = require('./models/user') ;
const PORT = 4501;

//Express App
const app = express();

app.use(express.json());

//Connect to DB ussing mongoose connect method
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
  app.listen(PORT, () => {
    console.log(`Connected to DB, Server running at http://localhost:${PORT}`);
  });
})
.catch(error => console.log('Error: ', error));

//Route to register user into DB
app.post('/register', (req, res) => {

  const { email, password } = req.body;

  //Check if email is not registered
  User.find({email: email})
  .then(result => {
    if(result.length > 0) res.send('User already exists');
    else {
      bcrypt.hash(password, 10)
      .then(hash => {
        const user = new User({
          email: email,
          password: hash
        });
        
        user.save()
        .then(result => res.send(result))
        .catch(error => console.log('Error: ', error));

      })
      .catch(error => console.log('Error: ', error));
    }
  })
  .catch(error => console.log('Error: ', error));
});

app.post('/login', (req, res) => {
  res.json('Login')
});

app.get('/profile', (req, res) => {
  res.json('Profile')
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
