const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    minlength: 2
  },
  description: {
    type: String,
    required: [true, 'description is required'],
    minlength: 5
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
    min: 1
  },
  stock: {
    type: Number,
    required: [true, 'stock is required']
  }
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product