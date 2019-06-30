const chai = require('chai')
const chaiHttp = require('chai-http')

const app = require('../app')
const expect = chai.expect

const deleteAllUsers = require('../helpers/deleteAllUsers')

after(function() {
  deleteAllUsers()
})

chai.use(chaiHttp)

describe('USER CRUD', function() {
  describe('REGISTER USERS', function() {
    describe('Successfullly registered user', function() {
      it('Should send an object with status code 201', function(done) {
        chai 
          .request(app)
          .post('/users/register')
          .send({
            firstName: 'admin',
            lastName: 'admin@',
            email: 'admin@admin.com',
            password: 'admin123'
          })
          .then(function(res) {
            expect(res).to.have.status(201)
            
            expect(res.body).to.have.property('firstName')
            expect(res.body.firstName).to.be.a('string')

            expect(res.body).to.have.property('lastName')
            expect(res.body.lastName).to.be.a('string')

            expect(res.body).to.have.property('email')
            expect(res.body.email).to.be.a('string').and.include('@')

            expect(res.body).to.have.property('password')
            expect(res.body.password).to.be.a('string')
            done()
          })
          .catch(function(err) {
            console.log(err)
          })
      })
    })
    describe('Unsuccessfully registered user', function(){
      it('should send an error with status code 400 when email format is incorrect', function(done){
        chai
          .request(app)
          .post('/users/register')
          .send({
            firstName: 'test_firstName',
            lastName: 'test_lastName',
            email: 'tesssmail.com',
            password: 'test12345'
          })
            .then(function(res) {
              expect(res).to.have.status(400)

              expect(res.body).to.have.property('message')
              expect(res.body.message).to.have.string('Incorrect email format')
              done()
            })
            .catch(function(err) {
              console.log(err)
            })
      })
      it('should send an error with status code 400 when email is not unique', function(done){
          chai
            .request(app)
            .post('/users/register')
            .send({
              firstName: 'test_firstName',
              lastName: 'test_lastName',
              email: 'admin@admin.com',
              password: 'test12345'
            })
            .then(function (res) {
              expect(res).to.have.status(400)

              expect(res.body).to.have.property('message')
              expect(res.body.message).to.have.string('Email is already registered')
              done()
            })
            .catch(function (err) {
              console.log(err)
            })
        })
      it('should send an error with status code 400 when password length is less than 8', function(done) {
          chai
            .request(app)
            .post('/users/register')
            .send({
              firstName: 'test_firstName',
              lastName: 'test_lastName',
              email: 'test2@mail.com',
              password: 'test12'
            })
            .then(function (res) {
              expect(res).to.have.status(400)

              expect(res.body).to.have.property('message')
              expect(res.body.message).to.have.string('shorter than the minimum allowed length (8)')
              done()
            })
            .catch(function (err) {
              console.log(err)
            })
      })
      it('should send an error with status code 400 when password length is less more than 12', function (done) {
        chai
          .request(app)
          .post('/users/register')
          .send({
            firstName: 'test_firstName',
            lastName: 'test_lastName',
            email: 'test3@mail.com',
            password: 'test122222222222222222222222'
          })
          .then(function (res) {
            expect(res).to.have.status(400)

            expect(res.body).to.have.property('message')
            expect(res.body.message).to.have.string('longer than the maximum allowed length (12)')
            done()
          })
          .catch(function (err) {
            console.log(err)
          })
      })
    })
  })

  describe('LOGIN USERS', function(){
    describe('Successfully logged in', function() {
      it('Should send an access token with status code 200', function(done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'admin@admin.com',
            password: 'admin123'
          })
          .then(function(res) {
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('access_token')
            done()
          })
          .catch(function(err) {
            console.log(err)
          })
      })
    })
    describe('Unsuccessfully logged in', function() {
      it('Should send an error with status code 400 when email is incorrect', function(done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'nonexistingemail@mail.com',
            password: 'blabla'
          })
          .then(function (res) {
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('message')
            expect(res.body.message).to.have.string('username/password invalid')

            done()
          })
          .catch(function (err) {
            console.log(err)
          })
      })
      it('Should send an error with status code 400 when password is incorrect', function (done) {
        chai
          .request(app)
          .post('/users/login')
          .send({
            email: 'test@mail.com',
            password: 'incorrectpassword'
          })
          .then(function (res) {
            expect(res).to.have.status(400)
            expect(res.body).to.have.property('message')
            expect(res.body.message).to.have.string('username/password invalid')

            done()
          })
          .catch(function (err) {
            console.log(err)
          })
      })
    })
  })
})