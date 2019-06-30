const Product = require('../models/product')

module.exports = function() {
  Product
    .deleteMany({})
    .then(function () {
      console.log('Products collection cleared!');
    })
    .catch(function (err) {
      console.log(err);
    });
  
}