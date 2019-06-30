const User = require('../models/user')
const { verifyPassword } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')



class UserController {
  static register(req, res, next) {
    const { firstName, lastName, email, password } = req.body
    const input = { firstName, lastName, email, password }
    User.create(input)
      .then(newUser => {
        res.status(201).json(newUser)
      })
      .catch(next)
  }

  static login(req, res, next) {
    console.log(req.body.email, req.body.password)
    User.findOne({
      email: req.body.email
    })
      .then(user => {
        if (user) {
          if (verifyPassword(req.body.password, user.password)) {
            const payload = {
              email: user.email,
              id: user.id
            }
            const token = generateToken(payload)
            res.status(200).json({
              firstName: user.firstName,
              lastName: user.lastName,
              access_token: token
            })
          }
          else {
            next({ code: 400, message: 'username/password invalid'})
          }
        }
        else {
          next({ code: 400, message: 'username/password invalid' })
        }
      })
      .catch(next)
  }
}

module.exports = UserController