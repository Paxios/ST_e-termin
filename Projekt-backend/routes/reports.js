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

/*router.use(jwt({
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

router.use(cors({ exposedHeaders: ['Authorization'] }))*/

/* GET porocilo */
router.get('/:idPodjetja', async function (req, res) {
    /*const idPodjetja = req.params.idPodjetja;
    var receipts = await database.getReceiptsByCompanyId(new mongo.ObjectID(idPodjetja));
    var racuni = [];
    racuni.forEach((racun) => {
        var storitev = await database.getPonudbaById(racun.id_storitev);
    })
    console.log(receipts);
    var podjetje = await database.getStoritevById(new mongo.ObjectID(idPodjetja));
    console.log(podjetje)
    generiraj(receipts, podjetje)
        .then((buffer) => {
            var porocilo = Buffer.from(buffer, "base64");
            var readStream = new stream.PassThrough();
            readStream.end(porocilo);

            res.set('Content-disposition', 'attachment; filename=Porocilo_o_poslovanju.xlsx');
            res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            readStream.pipe(res);
        })*/

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


module.exports = router;