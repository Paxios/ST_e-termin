var express = require('express');
var router = express.Router();
var database = require('../database/dao')
var verifikacija = require('../verification/verification')
var jwt = require('express-jwt');
var cors = require('cors')

router.use(jwt({
    secret: process.env.SECRET,
    algorithms: ['HS256']
}).unless({ path: [/^\/porocilo\/.*/, '/user/register', "/user/login", "/storitev/"] }));

router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.log(err.message);
        res.status(err.status).send({ message: err.message });
        return;
    }
    next();
});

router.use(cors({ exposedHeaders: ['Authorization'] }))

//POST add new employee
router.post("/:id/zaposleni", async (req, res) => {
    try {
        const { error } = verifikacija.zaposleni_scheme.validate(req.body)
        if (error != null) {
            res.status(400).json({ status: "error", reason: error })
            return
        }
        const new_zaposleni = await database.insertNewZaposleni(req.body, req.params.id);
        res.json(new_zaposleni);
    }
    catch (exception) {
        res.status(500).json({ status: "error", reason: exception })
    }
});

//DELETE remove zaposleni from database by id
router.delete("/:id/zaposleni/:id_zaposleni", async (req, res) => {
    try {
        const rezultat = await database.deleteZaposleni(req.params.id_zaposleni, req.params.id)
        if (rezultat == null) {
            res.status(404).json({ status: "ERROR", reason: "Zaposleni with this id does not exist." });
        }
        else {
            res.json(rezultat);
        }
    }
    catch (exception) {
        res.status(400).json({ status: "ERROR", reason: exception })
    }
});

//PUT update zaposleni by ID
router.put("/:id/zaposleni/:id_zaposleni", async (req, res) => {
    try {
        const { error } = verifikacija.zaposleni_scheme.validate(req.body)
        if (error != null) {
            res.status(400).json({ status: "error", reason: error })
            return
        }
        const rezultat = await database.updateZaposleni(req.body, req.params.id, req.params.id_zaposleni)
        if (rezultat === null) {
            res.status(404).json({ status: "error", reason: "Zaposleni with this id does not exist." })
        }
        else {
            res.json(rezultat)
        }
    }
    catch (exception) {
        res.status(500).json({ status: "error", reason: exception })
    }
});

module.exports = router;