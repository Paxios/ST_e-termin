var express = require('express');
var router = express.Router();
var database = require('../database/dao')
var verifikacija = require('../verification/verification')
var jwt = require('express-jwt');
var cors = require('cors')
var mongo = require('mongodb');

router.use(jwt({ secret: process.env.SECRET,
  algorithms: ['HS256']
}).unless({path: ['/user/register',"/user/login", "/storitev/"]}));

router.use((err, req, res, next) => {
  if(err.name === 'UnauthorizedError') {
    res.status(err.status).send({message:err.message});
    return;
  }
next();
});

router.use(cors({exposedHeaders:['Authorization']}))



//GET rezervacija by ID
router.get("/rezervacija/:id", async (req, res) => {
  const rezervacija = await database.getRezervacijaById(req.params.id)
  if (rezervacija == null) {
    res.status(404).json({ reason: "Reservation with this id does not exist." })
  }
  else {
    res.json(rezervacija);
  }
});

//GET all rezervacije by companyID
router.get("/storitev/:id/rezervacije", async (req, res) => {
  const rezervacije = await database.getRezervacijeByCompanyId(req.params.id)
  if (rezervacije.length === 0) {
    res.status(404).json({ "reason": "There's no reservations for this company ID or company ID does not exist." });
  }
  else {
    res.json(rezervacije);
  }
});

//POST add new rezervacija
router.post("/storitev/:id/rezervacija", async (req, res) => {
  try {
    req.body["id_podjetje"] = req.params.id
    const { error } = verifikacija.rezervacija_scheme.validate(req.body)
    if (error != null) {
      res.status(400).json({ status: "error", reason: error })
      return
    }
    const new_rezervacija = await database.insertNewRezervacija(req.body);
    res.json(new_rezervacija);
  }
  catch (exception) {
    res.status(500).json({ status: "error", reason: exception })
  }
});

//DELETE remove rezervacija from database by id
router.delete("/rezervacija/:id", async (req, res) => {
  try {
    const rezultat = await database.deleteRezervacija(req.params.id)
    if (rezultat == null) {
      res.status(404).json({ status: "ERROR", reason: "Reservation with this id does not exist." });
    }
    else {
      res.json(rezultat);
    }
  }
  catch (exception) {
    res.status(400).json({ status: "ERROR", reason: exception })
  }
});

//POST update rezervacija by ID
router.put("/storitev/:id/rezervacija/:rez_id", async (req, res) => {
  try {
    req.body["id_podjetje"] = req.params.id
    const { error } = verifikacija.rezervacija_scheme.validate(req.body)
    if (error != null) {
      res.status(400).json({ status: "error", reason: error })
      return
    }
    const rezultat = await database.updateRezervacija(req.params.rez_id, req.body)
    if (rezultat === null) {
      res.status(404).json({ status: "error", reason: "Reservation with this id does not exist." })
    }
    else {
      res.json(rezultat)
    }
  }
  catch (exception) {
    res.status(500).json({ status: "error", reason: exception })
  }
});

//GET occupied dates for calendar 
router.get("/storitev/:id/zasedeni_termini", async (req, res) => {
  const rezultat = await database.getSeznamZasedenihTerminov(req.params.id)
  res.json({occupied: rezultat})
});

module.exports = router;