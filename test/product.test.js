const chai = require('chai')
const chaiHttp = require('chai-http')

const app = require('../app')
const expect = chai.expect

const deleteAllProduct = require('../helpers/deleteAllProduct')


chai.use(chaiHttp)

require('./user.test')


after(function () {
  deleteAllProduct()
});

let product = {
  name: 'test_product',
  description: 'test_description',
  image: 'http://test.url',
  price: 22,
  stock: 33
}

// console.log(access_toke<n)
describe('Product CRUD', function () {

  /***  ADMIN ACCESS ***/
  let productId;
  describe('Product CRUD with admin access', function () {
    let access_token;
    describe('LOGIN FOR ADMIN ACCESS TOKEN', function () {
      it('Should send an access token with status code 200', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'admin@admin.com',
            password: 'admin123'
          })
          .then(function (res) {
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('access_token')
            access_token = res.body.access_token
            done()
          })
          .catch(function (err) {
            console.log(err)
          })
      })

      describe('POST /products', function () {
        describe('successfully added product', function () {
          it('should send an object with status code 201', function (done) {
            chai
              .request(app)
              .post('/products')
              .set('access_token', access_token)
              .send(product)
              .then(function (res) {
                expect(res).to.have.status(201)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('_id')
                productId = res.body._id

                expect(res.body).to.have.property('name')
                expect(res.body.name).to.be.a('string')

                expect(res.body).to.have.property('description')
                expect(res.body.description).to.be.a('string')

                expect(res.body).to.have.property('image')
                expect(res.body.image).to.be.a('String')

                expect(res.body).to.have.property('price')
                expect(res.body.price).to.be.a('number')


                expect(res.body).to.have.property('stock')
                expect(res.body.stock).to.be.a('number')

                done()
              })
              .catch(function (err) {
                console.log(err)
              })
          })
        })
        describe('unsuccessfully added product', function () {
          describe('error when product property is missing', function () {
            it('should send an error with status code 400 if name is missing', function (done) {
              chai
                .request(app)
                .post('/products')
                .set('access_token', access_token)
                .send({
                  description: 'test_description',
                  image: 'http://test.url',
                  price: 22,
                  stock: 33
                })
                .then(function (res) {
                  expect(res).to.have.status(400)
                  expect(res.body).to.have.property('message')
                  expect(res.body.message).to.include('name is required')
                  done()
                })
                .catch(err => {
                  console.log(err)
                })
            })
            it('should send an error with status code 400 if price is missing', function (done) {
              chai
                .request(app)
                .post('/products')
                .set('access_token', access_token)
                .send({
                  name: 'test_name',
                  description: 'test_description',
                  image: 'http://test.url',
                  stock: 33
                })
                .then(function (res) {
                  expect(res).to.have.status(400)
                  expect(res.body).to.have.property('message')
                  expect(res.body.message).to.include('price is required')
                  done()
                })
                .catch(err => {
                  console.log(err)
                })
            })
            it('should send an error with status code 400 if stock is missing', function (done) {
              chai
                .request(app)
                .post('/products')
                .set('access_token', access_token)
                .send({
                  name: 'test_name',
                  description: 'test_description',
                  image: 'http://test.url',
                  price: 33
                })
                .then(function (res) {
                  expect(res).to.have.status(400)
                  expect(res.body).to.have.property('message')
                  expect(res.body.message).to.include('stock is required')
                  done()
                })
                .catch(err => {
                  console.log(err)
                })
            })
          })
          describe('error when property value is invalid', function () {
            it('Should send an error with status code 400 if price is less than 1', function (done) {
              chai
                .request(app)
                .post('/products')
                .set('access_token', access_token)
                .send({
                  name: 'test_second_product',
                  description: 'test_second_description',
                  image: 'testurl.jpg',
                  price: 0,
                  stock: 33
                })
                .then(function (res) {

                  expect(res).to.have.status(400)
                  expect(res.body).to.have.property('message')
                  expect(res.body.message).to.have.string('less than minimum allowed value (1)')
                  done()
                })
                .catch(function (err) {
                  console.log(err)
                })
            })
            it('Should send an error with status code 400 if name length is less than 2', function (done) {
              chai
                .request(app)
                .post('/products')
                .set('access_token', access_token)
                .send({
                  name: 't',
                  description: 'test_second_description',
                  image: 'testurl.jpg',
                  price: 5,
                  stock: 33
                })
                .then(function (res) {
                  expect(res).to.have.status(400)
                  expect(res.body).to.have.property('message')
                  expect(res.body.message).to.have.string('shorter than the minimum allowed length (2)')
                  done()
                })
                .catch(function (err) {
                  console.log(err)
                })
            })
            it('Should send an errror with status code 400 if description length is less than 5', function (done) {
              chai
                .request(app)
                .post('/products')
                .set('access_token', access_token)
                .send({
                  name: 'testssadsadasd',
                  description: 'test',
                  image: 'testurl.jpg',
                  price: 5,
                  stock: 33
                })
                .then(function (res) {
                  expect(res).to.have.status(400)
                  expect(res.body).to.have.property('message')
                  expect(res.body.message).to.have.string('shorter than the minimum allowed length (5)')
                  done()
                })
                .catch(function (err) {
                  console.log(err)
                })
            })
          })
        })
      })

      describe('GET /products', function () {
        describe('Successfully returned list of products', function () {
          it('Should return an array of objects with status code 200', function (done) {
            chai
              .request(app)
              .get('/products')
              .set('access_token', access_token)
              .then(function (res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array')

                for (let product of res.body) {
                  expect(product).to.have.property('_id')
                  expect(product).to.have.property('name')
                  expect(product).to.have.property('description')
                  expect(product).to.have.property('image')
                  expect(product).to.have.property('price')
                  expect(product).to.have.property('stock')
                }
                done()
              })
              .catch(function (err) {
                console.log(err)
              })
          })
        })
      })

      describe('PATCH /products', function () {
        describe('Successfullly patched product', function () {
          it('Should return an object with status code 200', function (done) {
            chai
              .request(app)
              .patch(`/products/${productId}`)
              .set('access_token', access_token)
              .send({
                name: 'test_product_edited',
                description: 'test_description_edited',
                image: 'http://test.url',
                price: 22,
                stock: 33
              })
              .then(function (res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                done()

              })
              .catch(function (err) {
                console.log(err, 'ERROR PATCH SUCCESS ==========')
              })
          })
        })
        describe('Unsuccessfully patched product', function () {
          it('Should return an error with status code 400 when price is less than 1', function (done) {
            chai
              .request(app)
              .patch(`/products/${productId}`)
              .set('access_token', access_token)
              .send({
                name: 'test_product_edited',
                description: 'test_description_edited',
                image: 'http://test.url',
                price: 0,
                stock: 33
              })
              .then(function (res) {
                expect(res).to.have.status(400)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.have.string('less than minimum allowed value (1)')

                done()

              })
              .catch(function (err) {
                console.log(err)
              })
          })
          it('Should return an error with status code 400 whem description length is less than 5', function (done) {
            chai
              .request(app)
              .patch(`/products/${productId}`)
              .set('access_token', access_token)
              .send({
                name: 'test_product_edited',
                description: 'test',
                image: 'http://test.url',
                price: 33,
                stock: 33
              })
              .then(function (res) {
                expect(res).to.have.status(400)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.have.string('shorter than the minimum allowed length (5)')

                done()

              })
              .catch(function (err) {
                console.log(err)
              })
          })
          it('Should return an error with status code 400 whem name length is less than 2', function (done) {
            chai
              .request(app)
              .patch(`/products/${productId}`)
              .set('access_token', access_token)
              .send({
                name: 't',
                description: 'test_description_edited',
                image: 'http://test.url',
                price: 33,
                stock: 33
              })
              .then(function (res) {
                expect(res).to.have.status(400)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.have.string('shorter than the minimum allowed length (2)')

                done()

              })
              .catch(function (err) {
                console.log(err)
              })
          })
        })
      })

      describe('DELETE /products', function () {
        describe('Successfully deleted product', function () {
          it('Should return an object with status code 200', function (done) {
            chai
              .request(app)
              .delete(`/products/${productId}`)
              .set('access_token', access_token)
              .then(function (res) {
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('deletedCount').and.equal(1)
                done()
              })
              .catch(function (err) {
                console.log(err)
              })
          })
        })
      })
    })
  })

  /***  NON ADMIN ***/
  describe('Product CRUD without admin access', function () {
    let normal_token;
    describe('REGISTER  NORMAL USER', function () {
      it('Should send an object with status code 200', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            firstName: 'shandi',
            lastName: 'yuwono',
            email: 'shandi@mail.com',
            password: 'shandi123'
          })
          .then(function (res) {
            return chai
                .request(app)
                .post('/users/login')
                .send({
                  email: 'shandi@mail.com',
                  password: 'shandi123'
                })
          })
          .then(function(res) {
            normal_token = res.body.access_token
            done()
          })
          .catch(function (err) {
            console.log(err)
          })
      })
    })
    
    describe('/POST PRODUCTS', function() {
      it('Should send an error with status code 401', function(done) {
        chai 
          .request(app)
          .post('/products')
          .set('access_token', normal_token)
          .send(product)
          .then(function(res) {
            expect(res).to.have.status(401)
            expect(res.body).to.have.property('message').and.have.string('unauthorized')
            done()
          })
          .catch(function(err) {
            console.log(err)
          })
      })
    })

    describe('/GET PRODUCTS', function() {
      it('Should send an error with status code 401', function (done) {
        chai
          .request(app)
          .get('/products')
          .set('access_token', normal_token)
          .then(function (res) {
            expect(res).to.have.status(401)
            expect(res.body).to.have.property('message').and.have.string('unauthorized')
            done()
          })
          .catch(function (err) {
            console.log(err)
          })
      })
    })

    describe('/PATCH PRODUCTS', function () {
      it('Should send an error with status code 401', function (done) {
        chai
          .request(app)
          .patch(`/products/${productId}`)
          .set('access_token', normal_token)
          .send(product)
          .then(function (res) {
            expect(res).to.have.status(401)
            expect(res.body).to.have.property('message').and.have.string('unauthorized')
            done()
          })
          .catch(function (err) {
            console.log(err)
          })
      })
    })

    describe('/DELETE PRODUCTS', function() {
      it('Should send an error with status code 401', function (done) {
        chai
          .request(app)
          .delete(`/products/${productId}`)
          .set('access_token', normal_token)
          .then(function (res) {
            expect(res).to.have.status(401)
            expect(res.body).to.have.property('message').and.have.string('unauthorized')
            done()
          })
          .catch(function (err) {
            console.log(err)
          })
      })
    })
    
  })



})

