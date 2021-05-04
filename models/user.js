const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//The userSchema, describes the structure of the documents 
//that we want to save in the users collection, the second 
//parameter creates timestamps for createdAt and updatedAt
const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {timestamps: true});

//The first Parameter of the model method is important,
//because it will pluralize it and look for that collection
//in this case it will look for the "users" collection in the DB
const User = mongoose.model('User', userSchema);

module.exports = User;