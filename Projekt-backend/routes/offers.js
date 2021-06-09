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

//POST add new ponudba
router.post("/:id/ponudba", async (req, res) => {
    try {
        console.log(req.body)
        const { error } = verifikacija.ponudba_scheme.validate(req.body)
        if (error != null) {
            res.status(400).json({ status: "error", reason: error })
            return
        }
        const new_ponudba = await database.insertNewPonudba(req.body, req.params.id);
        res.json(new_ponudba);
    }
    catch (exception) {
        res.status(500).json({ status: "error", reason: exception })
    }
});

//DELETE remove ponudba from database by id
router.delete("/:id/ponudba/:id_ponudba", async (req, res) => {
    try {
        const rezultat = await database.deletePonudba(req.params.id_ponudba, req.params.id)
        if (rezultat == null) {
            res.status(404).json({ status: "ERROR", reason: "Ponudba with this id does not exist." });
        }
        else {
            res.json(rezultat);
        }
    }
    catch (exception) {
        res.status(400).json({ status: "ERROR", reason: exception })
    }
});

//PUT update ponudba by ID
router.put("/:id/ponudba/:id_ponudba", async (req, res) => {
    try {
        const { error } = verifikacija.ponudba_scheme.validate(req.body)
        if (error != null) {
            res.status(400).json({ status: "error", reason: error })
            return
        }
        const rezultat = await database.updatePonudba(req.body, req.params.id, req.params.id_ponudba)
        if (rezultat === null) {
            res.status(404).json({ status: "error", reason: "Ponudba with this id does not exist." })
        }
        else {
            res.json(rezultat)
        }
    }
    catch (exception) {
        res.status(500).json({ status: "error", reason: exception })
    }
});

//GET ponudba by id
router.get("/ponudba/:id", async (req, res) => {
    var ponudbaId = new mongo.ObjectID(req.params.id);
    const rezultat = await database.getPonudbaById(ponudbaId)
    res.json(rezultat);
});

module.exports = router;