require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

beforeAll(async () => {
  await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.exvcj.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
})


it('Should login and return 200', done => {
  request(app).post("/user/login")
  .send({
    uporabnisko_ime:"root",
    geslo:"root",
  })
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json')
  .expect(200, done)
});

it('Should register new user', done => {
  request(app).post("/user/register")
  .send({
    uporabnisko_ime:"jest-test",
    geslo:"jest-test",
    fake:"zlonamerna koda"
  })
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json')
  .expect(400, done)
})

it('Should register new user', done => {
  request(app).post("/user/register")
  .send({
    uporabnisko_ime:"jest-test"+Math.random()*1000000,
    geslo:"jest-test",
    inviteCode:""
  })
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json')
  .expect(200, done)
})


test('adds 1 + 2 to equal 3', () => {
  expect(3).toBe(3);
});

afterAll( () =>{
  mongoose.connection.close()
});