const router = require('express').Router()
const TransactionController = require('../controllers/transactioncontroller')
const { authentication } = require('../middlewares/authentication')

router.use(authentication)
router.get('/', TransactionController.getTransactions)

module.exports = router