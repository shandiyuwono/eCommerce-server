const router = require('express').Router()
const CartController = require('../controllers/cartcontroller')
const {authentication} = require('../middlewares/authentication')

router.use(authentication)
router.post('/', CartController.addToCart)
router.get('/', CartController.getCart)
router.delete('/:id', CartController.removeCart)
router.patch('/:id', CartController.updateCart)
router.post('/checkout', CartController.checkout)

module.exports = router