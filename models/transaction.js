const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionSchema = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  carts: [ { type: Schema.Types.ObjectId, ref:'Cart' } ],
  total: {
    type: Number
  },
  date: {
    type: Date
  }
}


const Transaction = mongoose.model('Transaction', TransactionSchema)

module.exports = Transaction