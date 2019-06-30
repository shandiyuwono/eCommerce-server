const Cart = require('../models/cart')

const Product = require('../models/cart')


module.exports = {
    authorization(req,res,next) {
        Cart.findOne({
            _id: req.params.id
        })
            .then(cart => {
                if(cart) {
                    const {id} = req.decode
                    let strObj = cart.user + ''
      
                    if(strObj === id) {                    
                        next()
                    }
                    else {
                        next({status: 401, message: "unauthorized"})
                    }
                }
                else {
                    next({code: 404})
                }
            })
            .catch(next)
    },


    adminAuthorization(req,res,next) {
      if(req.decode.email === "admin@admin.com") {
        next()
      }
      else{
        next({code: 401, message: "unauthorized"})
      }
    }
}