var express = require('express');
var router = express.Router();
var database = require('../database/dao')
var verifikacija = require('../verification/verification')
var jwt = require('express-jwt');
var cors = require('cors')
var mongo = require('mongodb')

router.use(jwt({
    secret: process.env.SECRET,
    algorithms: ['HS256']
}).unless({ path: ['/user/register', "/user/login"] }));

router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        console.log(err.message);
        res.status(err.status).send({ message: err.message });
        return;
    }
    next();
});

router.use(cors({ exposedHeaders: ['Authorization'] }))



//GET list of services
router.get("/", async (req, res) => {
    const rezultat = await database.getSeznamStoritev()
    res.json({ services: rezultat })
});

//GET service by id
router.get("/:storitevId", async (req, res) => {
    console.log(req.params.storitevId);
    var storitevId = new mongo.ObjectID(req.params.storitevId);
    const rezultat = await database.getStoritevById(storitevId)
    res.json(rezultat);
});

//UPDATE service
router.put("/:storitevId", async (req, res) => {
    var storitevId = new mongo.ObjectID(req.params.storitevId);
    try {
        const { error } = verifikacija.storitev_scheme.validate(req.body);
        if (error != null) {
            res.status(400).json({ status: "error", reason: error });
            return;
        }
        const rezultat = await database.updateStoritev(storitevId, req.body);
        if (rezultat === null) {
            res.status(404).json({ status: "error", reason: "Service with this id does not exist." });
        }
        else {
            res.json(rezultat);
        }
    }
    catch (exception) {
        res.status(500).json({ status: "error", reason: exception });
    }
});

//UPDATE service working hours
router.put("/:storitevId/delovnicas", async (req, res) => {
    var storitevId = new mongo.ObjectID(req.params.storitevId);
    try {
        const { error } = verifikacija.delovni_cas_scheme.validate(req.body);
        if (error != null) {
            res.status(400).json({ status: "error", reason: error });
            return;
        }
        const rezultat = await database.updateDelovniCas(storitevId, req.body);
        if (rezultat === null) {
            res.status(404).json({ status: "error", reason: "Service with this id does not exist." });
        }
        else {
            res.json(rezultat);
        }
    }
    catch (exception) {
        res.status(500).json({ status: "error", reason: exception });
    }
});

/* GET list of customers */
router.get('/stranke/:storitevId', async function (req, res, next) {
    try {
        const data = await database.getCustomerList(req.params.storitevId);
        res.json({ customers: data });
    }
    catch (error) {
        console.error(error);
    }
});

/* UPDATE working hours of service */
router.put('/delovnicas/:storitevId', async function (req, res, next) {
    try {
        const data = await database.updateWorkingHours(req.params.storitevId, req.body.workinghours);
        res.json({ result: data });
    }
    catch (error) {
        console.error(error);
    }
});

/* CREATE working hours of service */
router.post('/delovnicas/:storitevId', async function (req, res, next) {
    try {
        const data = await database.createWorkingHours(req.params.storitevId, req.body.workinghours);
        res.json({ result: data });
    }
    catch (error) {
        console.error(error);
    }
});

/* DELETE working hours of service */
router.delete('/delovnicas/:storitevId', async function (req, res, next) {
    try {
        const data = await database.deleteWorkingHours(req.params.storitevId);
        res.json({ result: data });
    }
    catch (error) {
        console.error(error);
    }
});

module.exports = router;