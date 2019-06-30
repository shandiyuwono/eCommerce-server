const Transaction = require('../models/transaction')

class TransactionController {
  static getTransactions(req,res,next) {
    Transaction.find({
      user: req.decode.id
    })
      .populate({
        path:'carts',
        populate: {
          path: 'product'
        }
      })
      .then(transactions => {
        res.status(200).json(transactions)
      })
      .catch(next)
  }

}

module.exports = TransactionController