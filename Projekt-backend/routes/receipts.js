var express = require('express');
var router = express.Router();
var database = require('../database/dao')
var verifikacija = require('../verification/verification')
var jwt = require('express-jwt');
var cors = require('cors')
var mongo = require('mongodb');

router.use(jwt({ secret: process.env.SECRET,
  algorithms: ['HS256']
}).unless({path: ['/user/register',"/user/login"]}));

router.use((err, req, res, next) => {
  if(err.name === 'UnauthorizedError') {
    console.log(err.message);
    res.status(err.status).send({message:err.message});
    return;
  }
next();
});

router.use(cors({exposedHeaders:['Authorization']}))


//GET rezervacija by ID
router.get("/:id", async (req, res) => {
  const rezervacija = await database.getRezervacijaById(req.params.id)
  if (rezervacija == null) {
    res.status(404).json({ reason: "Receipt with this id does not exist." })
  }
  else {
    res.json(rezervacija);
  }
});

//POST add new receipt
router.post("/:podjetjeId", async (req, res) => {
    try {
      req.body["id_podjetje"] = req.params.podjetjeId
      const { error } = verifikacija.racun_scheme.validate(req.body)
      if (error != null) {
        res.status(400).json({ status: "error", reason: error })
        return
      }
      const new_racun = await database.insertNewRacun(req.body);
      res.json(new_racun);
    }
    catch (exception) {
      res.status(500).json({ status: "error", reason: exception })
    }
  });

module.exports = router;