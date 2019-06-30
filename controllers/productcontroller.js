const Product = require('../models/product')

class ProductController {
  static getProducts(req,res,next) {
    Product.find()
      .then(products => {
        res.status(200).json(products)
      })
      .catch(next)
  }
  
  static findOne(req,res,next) {
    Product.findOne({
      _id: req.params.id
    })
      .then(product => {
        res.status(200).json(product)
      })
      .catch(next)
  }

  static addProduct(req,res,next) {
    // console.log('MASUKKK ')
    let image; 
    if (req.file && req.file.gcsUrl) {
      image = req.file.gcsUrl
    }

    // console.log(img)
    const { name, description, price, stock } = req.body

    Product.create({ name, description, image: image, price, stock })
      .then(product => {
        res.status(201).json(product)
      })
      .catch(next)
  }

  static updateProduct(req,res,next) {
    const { name, description, price, stock } = req.body
    let image;
    if (req.file && req.file.gcsUrl) {
      image = req.file.gcsUrl
    }
    Product.findOne({
      _id: req.params.id
    })
      .then(product => {
        product.name = name
        product.description = description
        product.image = image
        product.price = price
        product.stock = stock
        
        return product.save()
      })
      .then(edited => {
        res.status(200).json(edited)
      })
      .catch(next)
  }

  static deleteProduct(req,res,next) {
    
    Product.deleteOne({
      _id: req.params.id
    })
      .then(deleted => {
        res.status(200).json(deleted)
      })
      .catch(next)
  }
}

module.exports = ProductController