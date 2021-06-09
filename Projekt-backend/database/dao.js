const mongoose = require('mongoose');
const database = require('../database/models')
const security = require('../security/security')

const getRezervacijaById = async (rezervacijaId) => {
    const rez = database.Rezervacija.findById(rezervacijaId)
        .then((rezervacija) => {
            return rezervacija;
        })
        .catch(() => {
            return null;
        })
    return rez;
}

const getRezervacijeByCompanyId = async (companyId) => {
    return await database.Rezervacija.find({ id_podjetje: companyId })
}

const insertNewRezervacija = async (rezervacija) => {
    rezervacija["_id"] = mongoose.Types.ObjectId();
    const new_rezervacija = database.Rezervacija(rezervacija);

    try {
        await new_rezervacija.save((err) => {
            if (err != null) {
                console.log({ status: "error, failed to save rezervacija into database", reason: err })
                return null;
            }
        })
    }
    catch (exception) {
        console.log({
            status: "ERROR trying to save rezervacija in database. Probably same ID",
            reason: exception
        });
    }
    return new_rezervacija;

}

const deleteRezervacija = async (rezervacijaId) => {
    return await database.Rezervacija.findByIdAndDelete(rezervacijaId);
}

const updateRezervacija = async (rezervacijaId, rezervacija) => {
    return await database.Rezervacija.findByIdAndUpdate(rezervacijaId, rezervacija, { useFindAndModify: false })
}


const getSeznamZasedenihTerminov = async (companyId) => {
    const zasedeniTermini = [];
    const rezervacije = await getRezervacijeByCompanyId(companyId);
    for (rezervacija of rezervacije) {
        const termin = {
        }

        let date;
        if (typeof rezervacija.datum == "String") {
            date = Date.parse(rezervacija.datum);
        }
        else {
            date = new Date(rezervacija.datum);
        }

        end_date = new Date(rezervacija.datum);
        end_date.setMinutes(end_date.getMinutes() + rezervacija.trajanje);

        termin["storitev"] = rezervacija.id_storitev
        termin["start_date"] = date;
        termin["end_date"] = end_date;
        zasedeniTermini.push(termin);


    }
    return zasedeniTermini;
}

const deleteUser = async (user_name) => {
    return await database.User.deleteOne({ uporabnisko_ime: user_name })
}

const register = async (user_details) => {
    const userWithSameUsername = await database.User.findOne({ uporabnisko_ime: user_details.uporabnisko_ime })
    if (userWithSameUsername != null) {
        const err = { status: "ERROR", code: 400, reason: "User with this username already exists" };
        return err;
    }
    let geslo = user_details.geslo;
    geslo = security.hash_password(geslo);

    var userCompany;
    if (user_details.inviteCode === "") {
        userCompany = await generateNewCompany();
    }
    else {
        userCompany = await database.Storitev.findOne({ inviteCode: user_details.inviteCode })
        if (userCompany == null) {
            const err = { status: "ERROR", code: 400, reason: "Your invite code is invalid" };
            return err;
        }
    }
    const new_user = database.User({
        uporabnisko_ime: user_details.uporabnisko_ime,
        geslo: geslo,
        id_podjetje: userCompany._id,
        _id: mongoose.Types.ObjectId()
    });

    var user = await new_user.save().then((data) => {
        return data;
    })
        .catch((err) => {
            const error = { status: "ERROR", code: 500, reason: err };
            return error;
        })
    return user;
}

async function generateNewCompany() {
    const new_company = database.Storitev({
        ime: "",
        naslov: "",
        tip: "",
        lokacija: {
            x: 0,
            y: 0
        },
        opis: "",
        ponudba: [],
        zaposleni: [],
        delovniCas: {
            pon: {
                zacetek: "00:00",
                konec: "00:00"
            },
            tor: {
                zacetek: "00:00",
                konec: "00:00"
            },
            sre: {
                zacetek: "00:00",
                konec: "00:00"
            },
            cet: {
                zacetek: "00:00",
                konec: "00:00"
            },
            pet: {
                zacetek: "00:00",
                konec: "00:00"
            },
            sob: {
                zacetek: "00:00",
                konec: "00:00"
            },
            ned: {
                zacetek: "00:00",
                konec: "00:00"
            }
        },
        inviteCode: getRandomString(),
        _id: mongoose.Types.ObjectId()
    });

    var company = await new_company.save().then((data) => {
        return data;
    })
        .catch((err) => {
            const error = { status: "ERROR", code: 500, reason: err };
            return error;
        })
    return company;
}

function getRandomString() {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < 32; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

const getUserByUsername = async (uporabnisko_ime) => {
    return await database.User.findOne({ uporabnisko_ime });
}

const getSeznamStoritev = async () => {
    return await database.Storitev.find({});
}

const getStoritevById = async (id) => {
    return await database.Storitev.findOne({ _id: id });
}

const deleteStoritev = async (storitevId) => {
    return await database.Storitev.findByIdAndDelete(storitevId);
}

const getPonudbaById = async (id) => {
    console.log(id);
    //iz nekega razloga ne dela več
    return await database.Storitev.findOne({ 'ponudba.id': id }, { 'ponudba.$': 1 });
}
const updateStoritev = async (storitevId, storitev) => {
    return await database.Storitev.findByIdAndUpdate(storitevId, storitev, { useFindAndModify: false })
}

const updateDelovniCas = async (storitevId, delovniCas) => {
    var storitev = await database.Storitev.findOne({ _id: storitevId });
    var novaStoritev = JSON.parse(JSON.stringify(storitev));
    novaStoritev.delovniCas = delovniCas;
    console.log(novaStoritev);
    return updateStoritev(storitevId, novaStoritev);
    //return await database.Storitev.findByIdAndUpdate(storitevId, novaStoritev, { useFindAndModify: false });
}

const getCustomerList = async (serviceId) => {
    //return await database.Rezervacija.find({ id_storitev: serviceId })
    return new Promise((res) => {
        database.Rezervacija.find({ id_storitev: serviceId })
            .then((reservations) => {
                var customers = [];
                reservations.forEach((reservation) => {
                    customers.push(reservation.stranka);
                });
                res(customers);
            })
            .catch((error) => {
                console.error(error);
                res("serviceNotFound");
            });
    });
}

const getReceiptsByCompanyId = async (companyId) => {
    return new Promise((res) => {
        database.Racun.find({ id_podjetje: companyId })
            .then((receipts) => {
                res(receipts);
            })
            .catch((error) => {
                console.error(error);
                res("serviceNotFound");
            });
    });
}

const getReceiptById = async (id) => {
    return new Promise((res) => {
        database.Racun.findOne({ _id: id })
            .then((receipt) => {
                res(receipt);
            })
            .catch((error) => {
                console.error(error);
                res("receiptNotFound");
            });
    });
}

const deleteReceiptById = async (id) => {
    return new Promise((res) => {
        database.Racun.findByIdAndRemove({ _id: id })
            .then((result) => {
                res(result);
            })
            .catch((error) => {
                console.error(error);
                res("receiptNotFound");
            });
    });
}

const insertNewRacun = async (racun) => {
    racun["_id"] = mongoose.Types.ObjectId();
    const new_racun = database.Racun(racun);

    try {
        await new_racun.save((err) => {
            if (err != null) {
                console.log({ status: "error, failed to save rezervacija into database", reason: err })
                return null;
            }
        })
    }
    catch (exception) {
        console.log({
            status: "ERROR trying to save rezervacija in database. Probably same ID",
            reason: exception
        });
    }
    return new_racun;

}
const countServicesInReceipts = async (id) => {
    return await database.Racun.aggregate([
        {
            $match: { id_podjetje: id }
        },
        {
            $group: {
                _id: '$id_storitev', count: { $sum: 1 }
            }
        }
    ]);
}

const countReservations = async (id) => {
    console.log("DB" + id);
    return await database.Rezervacija.aggregate([
        {
            $match: { id_podjetje: id }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$datum" } },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $project: {
                _id: 0,
                name: "$_id",
                count: 1
            }
        },
        {
            $sort: { name: 1 }
        }
    ]);
}

const insertNewZaposleni = async (zaposleni, id_podjetje) => {
    var storitev = await database.Storitev.findOne({ '_id': id_podjetje });
    storitev.zaposleni.push(zaposleni)
    return await database.Storitev.findByIdAndUpdate(storitev._id, storitev, { useFindAndModify: false })
}

const deleteZaposleni = async (id_zaposleni, id_podjetje) => {
    var storitev = await database.Storitev.findOne({ '_id': id_podjetje });
    storitev.zaposleni.forEach(element => {
        if(element._id==id_zaposleni){
            storitev.zaposleni.splice(storitev.zaposleni.indexOf(element), 1);
        }
    });
    return await database.Storitev.findByIdAndUpdate(storitev._id, storitev, { useFindAndModify: false })
}

const updateZaposleni = async (zaposleni, id_podjetje, id_zaposleni) => {
    var storitev = await database.Storitev.findOne({ '_id': id_podjetje });
    storitev.zaposleni.forEach(element => {
        if(element._id==id_zaposleni){
            Object.assign(element, zaposleni);
        }
    });
    return await database.Storitev.findByIdAndUpdate(storitev._id, storitev, { useFindAndModify: false })
}

exports.updateStoritev = updateStoritev;
exports.getSeznamStoritev = getSeznamStoritev;
exports.getCustomerList = getCustomerList;
exports.getRezervacijeByCompanyId = getRezervacijeByCompanyId;
exports.getRezervacijaById = getRezervacijaById;
exports.insertNewRezervacija = insertNewRezervacija;
exports.deleteRezervacija = deleteRezervacija;
exports.updateRezervacija = updateRezervacija;
exports.getSeznamZasedenihTerminov = getSeznamZasedenihTerminov;
exports.register = register;
exports.deleteUser = deleteUser;
exports.getUserByUsername = getUserByUsername;
exports.getStoritevById = getStoritevById;
exports.deleteStoritev = deleteStoritev;
exports.insertNewRacun = insertNewRacun;
exports.getReceiptsByCompanyId = getReceiptsByCompanyId;
exports.getReceiptById = getReceiptById;
exports.getPonudbaById = getPonudbaById;
exports.deleteReceiptById = deleteReceiptById;
exports.countServicesInReceipts = countServicesInReceipts;
exports.countReservations = countReservations;
exports.updateDelovniCas = updateDelovniCas;
exports.insertNewZaposleni = insertNewZaposleni;
exports.deleteZaposleni = deleteZaposleni;
exports.updateZaposleni = updateZaposleni;