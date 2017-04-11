require('./../../config/config');
var {mongoose} = require('./../../db/mongoose');
var {User} = require('./../../models/user');

var user = new User({
	email: "admin",
	password: "password132"
});

user.save().then( (result) => {
  if(!result) {
    console.log("failure1");
  }
  console.log('success');
}).catch( (e) => {
  console.log(e);
});