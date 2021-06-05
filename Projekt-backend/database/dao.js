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

const register = async (user_details) => {
    const userWithSameUsername = await database.User.findOne({ uporabnisko_ime: user_details.uporabnisko_ime })
    if (userWithSameUsername != null) {
        const err = { status: "ERROR", code: 400, reason: "User with this username already exists" };
        return err;
    }
    let geslo = user_details.geslo;
    geslo = security.hash_password(geslo);

    const new_user = database.User({
        uporabnisko_ime: user_details.uporabnisko_ime,
        geslo: geslo,
        id_podjetje: user_details.id_podjetje,
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

const getUserByUsername = async (uporabnisko_ime) => {
    return await database.User.findOne({uporabnisko_ime});
}

const getSeznamStoritev = async () => {
    return await database.Storitev.find({});
}

const getStoritevById = async (id) => {
    return await database.Storitev.findOne({ _id: id });
}

const updateStoritev = async (storitevId, storitev) => {
    return await database.Storitev.findByIdAndUpdate(storitevId, storitev, { useFindAndModify: false })
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
exports.getUserByUsername = getUserByUsername;
exports.getStoritevById = getStoritevById;