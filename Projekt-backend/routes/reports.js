var express = require('express');
var router = express.Router();
var database = require('../database/dao')
var verifikacija = require('../verification/verification')
var jwt = require('express-jwt');
var cors = require('cors')
var mongo = require('mongodb');
const { Storitev } = require('../database/models');
var { generiraj } = require("../generator/ExcelReportGenerator");
var stream = require('stream');
const base64 = require('base64topdf')
const { generatePdfReceiptsReportData } = require('../generator/PdfInvoiceGenerator');
var easyinvoice = require('easyinvoice');

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

/* GET porocilo */
router.get('/:idPodjetja', async function (req, res) {
    const idPodjetja = req.params.idPodjetja;
    var podjetje = await database.getStoritevById(new mongo.ObjectID(idPodjetja));
    var receipts = await database.getReceiptsByCompanyId(new mongo.ObjectID(idPodjetja));
    var racuni = [];
    var loop = new Promise((resolve, reject) => {
        receipts.forEach((receipt, index, array) => {
            console.log(receipt);
            database.getPonudbaById(new mongo.ObjectID(receipt.id_storitev))
                .then((storitev) => {
                    console.log(storitev);
                    var racun = {
                        _id: receipt._id,
                        storitev: storitev.ponudba[0],
                        id_rezervacija: receipt.id_rezervacija,
                        ime_stranke: receipt.ime_stranke,
                        priimek_stranke: receipt.priimek_stranke,
                        zaposleni: receipt.zaposleni,
                        datum: receipt.datum,
                        opomba: receipt.opomba,
                        cena: receipt.cena
                    }
                    racuni.push(racun);
                    console.log(racuni.length);
                    if (index === array.length - 1) resolve();
                })
        });
    });
    loop.then(() => {
        console.log(racuni);
        generiraj(racuni, podjetje)
            .then((buffer) => {
                var porocilo = Buffer.from(buffer, "base64");
                var readStream = new stream.PassThrough();
                readStream.end(porocilo);


                res.set('Content-disposition', 'attachment; filename=Porocilo_o_poslovanju.xlsx');
                res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                readStream.pipe(res);
            })
    })

});

router.get("/:idPodjetja/racuni/count", async function (req, res) {
    database.countServicesInReceipts(req.params.idPodjetja)
        .then((result) => {
            var storitve = [];
            var loop = new Promise((resolve, reject) => {
                result.forEach((service, index, array) => {
                    database.getPonudbaById(new mongo.ObjectID(service._id))
                        .then((storitev) => {
                            console.log(storitev);
                            var storitevItem = {
                                name: storitev.ponudba[0].ime,
                                znesek: storitev.ponudba[0].cena * service.count,
                                count: service.count
                            }
                            storitve.push(storitevItem);
                            if (index === array.length - 1) resolve();
                        });
                });
            });
            loop.then(() => {
                res.json(storitve);
            });
        })
        .catch(err => {
            res.status(404).json({ reason: "no receipts found" });
        })
});

router.get("/:idPodjetja/rezervacije/count", async function (req, res) {
    database.countReservations(req.params.idPodjetja)
        .then((result) => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({ reason: "no reservations found" });
        })
});

//GET racun pdf by ID
router.get("/:podjetjeId/racuni/pdf", async (req, res) => {
    const receipts = await database.getReceiptsByCompanyId(new mongo.ObjectID(req.params.podjetjeId));
    if (receipts.length > 0) {
        var podjetje = await database.getStoritevById(new mongo.ObjectID(req.params.podjetjeId));
        var invoice = generatePdfReceiptsReportData(receipts, podjetje);
        console.log(invoice);
        easyinvoice.createInvoice(invoice, function (result) {
            res.set('Content-Type', 'text/html');
            res.send(JSON.stringify(result.pdf));
        });
    }
    else {
        res.status(404).json({ reason: "receipt with this id does not exist." })
    }
});


module.exports = router;