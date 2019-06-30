const router = require('express').Router()
const userRouter = require('./userrouter')
const productRouter = require('./productrouter')
const cartRouter = require('./cartrouter')
const transactionRouter = require('./transactionrouter')

router.use('/users', userRouter)
router.use('/products', productRouter)
router.use('/carts', cartRouter)
router.use('/transactions', transactionRouter)

module.exports = router