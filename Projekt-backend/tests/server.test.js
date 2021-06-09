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
var updated_company_info = {}

const new_reservation = {
  ime_stranke: "Pavla",
  priimek_stranke: "Rožle",
  tel_st: "123456789",
  datum: "2021-06-03T20:00:00.000Z",
  trajanje: 120,
  delo: "Pranje + likanje"
}

const new_company_info = {
  ime: "Frizeraj Metka",
  naslov: "Frizerska ulica 77",
  tip: "Frizerstvo",
  lokacija: {
    x: 46.77,
    y: 15.89
  },
  opis: "Najboljši frizeraj dalč naokol.",
}

const new_employee = {
  naziv: "Jest Test",
  telefon: "030123123",
  _id: mongoose.Types.ObjectId()
}

const new_ponudba = {
  ime: "Grillanje",
  opis: "Za vas zgrillamo vse",
  trajanje: 120,
  cena: 40,
  id: mongoose.Types.ObjectId()
}

const new_receipt = {
  id_storitev: "60bf60e550875b87396bdaf2",
  ime_stranke: "Janez",
  priimek_stranke: "Novak",
  zaposleni: {
    _id: "60bf586ed99af3c37c43748a",
    naziv: "frizerka Dragica",
    telefon: "041999888"
  },
  datum: "2021-06-09T12:02:52.820Z",
  opomba: "Striženjenje las z mašinco",
  cena: "10.99"
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

it('Modify company info', done => {
  request(app).put(`/storitev/${user_details.company_id}`)
    .send(new_company_info)
    .set('Authorization', auth_token)
    .end((err, resp) => {
      if (err) return done(err);
      updated_company_info = resp.body;
      done()
    })
});

it("Add new employee", done => {
  request(app)
    .post(`/storitev/${updated_company_info._id}/zaposleni`)
    .send(new_employee)
    .set('Authorization', auth_token)
    .end((err, resp) => {
      if (err) return done(err);
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toHaveProperty("zaposleni")
      console.log(resp.body)
      done()
    });
});

it("Add new ponudba", done => {
  request(app)
    .post(`/storitev/${updated_company_info._id}/ponudba`)
    .set('Authorization', auth_token)
    .send(new_ponudba)
    .expect(200)
    .end((err, resp) => {
      if (err) return done(err)
      updated_company_info = resp.body;
      done();
    })
});


it("Delete new employee", done => {
  request(app)
    .delete(`/storitev/${updated_company_info._id}/zaposleni/${new_employee._id}`)
    .set('Authorization', auth_token)
    .expect(200)
    .end((err, resp) => {
      if (err) return done(err);
      updated_company_info = resp.body;
      done();
    });
});

it("Delete new ponudba", done => {
  request(app)
  .delete(`/storitev/${updated_company_info._id}/ponudba/${updated_company_info.zaposleni[0]._id}`)
  .set('Authorization', auth_token)
  .expect(200,done)
});

it("Delete new ponudba without auth", done => {
  request(app)
  .delete(`/storitev/${updated_company_info._id}/ponudba/${updated_company_info.zaposleni[0]._id}`)
  .expect(401,done)
});

it('Delete company', done => {
  request(app).delete(`/storitev/${updated_company_info._id}`)
    .set('Authorization', auth_token)
    .expect(200, done);
});

it('Delete user', done => {
  request(app).delete("/user").send({
    uporabnisko_ime: username
  })
    .set('Authorization', auth_token)
    .expect(200, done);
})

it('Add new receipt', done => {
  request(app)
    .post(`/racun/storitev/${user_details.company_id}`)
    .send(new_receipt)
    .set('Authorization', auth_token)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('id_podjetje');
      expect(res.body).toHaveProperty('id_storitev');
      expect(res.body).toHaveProperty('ime_stranke');
      expect(res.body).toHaveProperty('priimek_stranke');
      expect(res.body).toHaveProperty('zaposleni');
      expect(res.body).toHaveProperty('datum');
      expect(res.body).toHaveProperty('cena');
      new_receipt._id = res.body._id
      console.log(res.body._id);
      done();
    })
});

it('Delete receipt', done => {
  console.log(new_receipt._id);
  request(app)
    .delete(`/racun/${new_receipt._id}`)
    .set('Authorization', auth_token)
    .end((err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    })
})

afterAll(() => {
  mongoose.connection.close()
});