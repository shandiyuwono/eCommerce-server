const User = require('../models/user')

module.exports = function() {
  User.deleteMany()
    .then(() => {
      console.log('User collection cleared!')
    })
    .catch(err => {
      console.log(err)
    })
}