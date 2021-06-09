var express = require('express');
var router = express.Router();
var database = require('../database/dao')
var verifikacija = require('../verification/verification')
var jwt = require('express-jwt');
var cors = require('cors')
var mongo = require('mongodb');
const { Storitev } = require('../database/models');
const { generatePdfInvoiceData } = require('../generator/PdfInvoiceGenerator');
var easyinvoice = require('easyinvoice');
const base64 = require('base64topdf');

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


//GET racuni by company ID
router.get("/storitev/:id", async (req, res) => {
    console.log("get racuni");
    const receipts = await database.getReceiptsByCompanyId(new mongo.ObjectID(req.params.id));
    if (receipts == null) {
        res.status(404).json({ reason: "Company with this id does not exist." })
    }
    else {
        res.json(receipts);
    }
});

//GET racun pdf by ID
router.get("/:id/pdf", async (req, res) => {
    const receipt = await database.getReceiptById(new mongo.ObjectID(req.params.id));
    if (receipt != null) {
        var podjetje = await database.getStoritevById(new mongo.ObjectID(receipt.id_podjetje));
        var storitev = await database.getPonudbaById(new mongo.ObjectID(receipt.id_storitev));
        var invoice = generatePdfInvoiceData(receipt, podjetje, storitev.ponudba[0]);
        easyinvoice.createInvoice(invoice, function (result) {
            res.set('Content-Type', 'text/html');
            res.send(JSON.stringify(result.pdf));
        });
    }
    else {
        res.status(404).json({ reason: "receipt with this id does not exist." })
    }
});

//GET racun and all related objects by id
router.get("/:id/full", async (req, res) => {
    var receipt = await database.getReceiptById(new mongo.ObjectID(req.params.id));
    if (receipt != null) {
        var podjetje = await database.getStoritevById(new mongo.ObjectID(receipt.id_podjetje));
        var storitev = await database.getPonudbaById(new mongo.ObjectID(receipt.id_storitev));
        var result = {
            _id: receipt._id,
            storitev: storitev.ponudba[0],
            podjetje: podjetje,
            id_rezervacija: receipt.id_rezervacija,
            ime_stranke: receipt.ime_stranke,
            priimek_stranke: receipt.priimek_stranke,
            zaposleni: receipt.zaposleni,
            datum: receipt.datum,
            opomba: receipt.opomba,
            cena: receipt.cena
        }
        res.json(result);
    }
    else {
        res.status(404).json({ reason: "receipt with this id does not exist." })
    }

});

//GET racun by ID
router.get("/:id", async (req, res) => {
    const receipt = await database.getReceiptById(new mongo.ObjectID(req.params.id));
    if (receipt == null) {
        res.status(404).json({ reason: "Receipt with this id does not exist." })
    }
    else {
        res.status(200);
    }
});

//DELETE racun by ID
router.delete("/:id", async (req, res) => {
    const receipt = await database.deleteReceiptById(new mongo.ObjectID(req.params.id));
    if (receipt == null) {
        res.status(404).json({ reason: "Receipt with this id does not exist." })
    }
    else {
        res.json(receipt);
    }
});


//POST add new racun
router.post("/storitev/:podjetjeId", async (req, res) => {
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