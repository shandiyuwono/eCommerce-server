
const Cart = require('../models/cart')
const Transaction = require('../models/transaction')
const ObjectID = require('mongodb').ObjectID

class CartController {

  static addToCart(req, res, next) {
    Cart.findOne({
      user: req.decode.id,
      product: req.body.productId,
      checkoutStatus: false
    })
      .then(cart => {
        if(cart) {
          cart.quantity += req.body.quantity
          cart.totalPrice += req.body.quantity * req.body.price
          cart.save()
        }
        else{
          return Cart.create({
            user: req.decode.id,
            product: req.body.productId,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice,
            checkoutStatus: false
          })
        }
      })
      .then(newCart => {
        res.status(201).json(newCart)
      })
      .catch(next)
  }

  static getCart(req,res,next) {
    Cart.find({
      user: req.decode.id,
      checkoutStatus: false
    })
      .populate('product')
      .then(cart => {
        res.status(200).json(cart)
      })
      .catch(next)
  }

  static updateCart(req,res,next) {
    Cart.findOne({
      _id: req.params.id,
      user: req.decode.id
    })
      .then(cart => {
        if(req.body.status === 'decrement') {
          cart.quantity--
          cart.totalPrice -= req.body.price
        }
        else{
          cart.quantity++
          cart.totalPrice += req.body.price
        }

        return cart.save()
      })
      .then(edited => {
        res.status(200).json(edited)
      })
      .catch(next)
  }
 
  static removeCart(req,res,next) {
    // console.log('MASUKK')
    Cart.deleteOne({
      _id: req.params.id
    })
      .then((deleted) => {
        res.status(200).json(deleted)
      })
      .catch(next)
  }

  static checkout(req, res, next) {
    Cart.find({
      user: req.decode.id,
      checkoutStatus: false
    })
      .then(carts => {
        
        let products = []
        let total = 0
        for (let cart of carts) {
          products.push(ObjectID(cart._id))
          total += cart.totalPrice
        }
       
        return Transaction.create({
          user: req.decode.id,
          carts: products,
          total: total,
          date: new Date()
        })
      })
      .then(() => {
        return Cart.updateMany({
          user: req.decode.id,
          checkoutStatus: false
        }, {checkoutStatus: true})
      })
      .then(cart => {
        res.status(200).json(cart)
      })
      .catch(next)

  }
}

module.exports = CartController