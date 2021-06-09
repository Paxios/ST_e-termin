require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const security = require('../security/security')

var auth_token = "";
const username = "jest-test";
const password = "jest_test_pass";
var user_details = {};
var added_reservation = {}

const new_reservation = {
  ime_stranke: "Pavla",
  priimek_stranke: "Rožle",
  tel_st: "123456789",
  datum: "2021-06-03T20:00:00.000Z",
  trajanje: 120,
  delo: "Pranje + likanje"
}

beforeAll(async () => {
  await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.exvcj.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
})


// it('Login and return 200', done => {
//   request(app).post("/user/login")
//     .send({
//       uporabnisko_ime: "root",
//       geslo: "root",
//     })
//     .set('Content-Type', 'application/json')
//     .set('Accept', 'application/json')
//     .expect(200, done)
// });

it('Throw error when registering new user', done => {
  request(app).post("/user/register")
    .send({
      uporabnisko_ime: username,
      geslo: password,
      fake: "zlonamerna koda"
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .expect(400, done)
})

it('Register new user', done => {
  request(app).post("/user/register")
    .send({
      uporabnisko_ime: username,
      geslo: password,
      inviteCode: ""
    })
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .expect(200, done)
})

it('Login with created user', done => {
  request(app).post("/user/login").send(
    {
      uporabnisko_ime: username,
      geslo: password
    }
  )
    .end((err, resp) => {
      if (err) return done(error);
      auth_token = resp.headers.authorization;
      user_details = security.validateJWT(auth_token.split("Bearer ")[1]);
      new_reservation["id_storitev"] = mongoose.Types.ObjectId();
      done();
    });
});


it('Add new reservation', done => {
  request(app).post(`/storitev/${user_details.company_id}/rezervacija`)
    .send(new_reservation)
    .set('Authorization', auth_token)
    .end((err, resp) => {
      if (err) return done(err);
      added_reservation = resp.body;
      done()
    })
});

it('Unauthorized Add reservation', done => {
  request(app).post(`/storitev/${user_details.company_id}/rezervacija`)
    .send(new_reservation)
    .expect(401, done)
});

it('Delete reservation', done => {
  request(app).delete(`/rezervacija/${added_reservation._id}`)
  .set('Authorization', auth_token)
  .expect(200, done)
});

it('Delete reservation - not found', done => {
  request(app).delete(`/rezervacija/${added_reservation._id}`)
  .set('Authorization', auth_token)
  .expect(404, done)
});

it('Delete reservation - bad id', done => {
  request(app).delete(`/rezervacija/zlonameren`)
  .set('Authorization', auth_token)
  .expect(400, done)
});

it('Delete user', done => {
  request(app).delete("/user").send({
    uporabnisko_ime: username
  })
    .set('Authorization', auth_token)
    .expect(200, done);
});

afterAll(() => {
  mongoose.connection.close()
});