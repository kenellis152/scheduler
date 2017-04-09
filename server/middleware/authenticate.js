var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
  var token = req.header('x-schedulerauth');

  User.findByToken(token).then( (user) => {
    if(!user) {
      return Promise.reject();
      //this causes the block to immediately terminate and the following catch block to execute
    }

    req.user = user;
    req.token = token;
    next();
  }).catch( (e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
