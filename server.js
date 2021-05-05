const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { createTokens, validateToken } = require('./jwt');

const bcrypt = require('bcrypt');
const URL = 'mongodb://127.0.0.1:27017/testdbs';
const User = require('./models/user') ;
const PORT = 4501;

//Express App
const app = express();

app.use(express.json());
app.use(cookieParser());

//Connect to DB ussing mongoose connect method
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
  app.listen(PORT, () => {
    console.log(`Connected to DB, Server running at http://localhost:${PORT}`);
  });
})
.catch(error => console.log('Error: ', error));

//Route to register user into DB
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try{
    //Check if email is not registered
    const repeated = await User.find({email: email})
    if(repeated.length > 0) res.send('User already exists');
    else {
      const hash = await bcrypt.hash(password, 10)
      const user = new User({
        email: email,
        password: hash
      });
      const result = await user.save()
      res.send(result)
    }
  }catch(error){
    console.log('Error: ', error)
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.find({email: email});
  if(user.length === 0) res.status(400).json({error: "Email doesn't exist"});
  console.log("USER: ", user);
  const dbPassword = user[0].password;
  const match = await bcrypt.compare(password, dbPassword);
  if(!match) res.status(400).json({error: "Wrong email and password combiantion"});
  else{
    const accessToken = createTokens(user);
    console.log("AT: ", accessToken);
    res.cookie("access-token", accessToken, { maxAge: 60*60*1000 })
    res.json('LOGGED IN');
  }
});

app.get('/profile', validateToken, (req, res) => {
  res.json('Profile')
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});