const joi = require('joi');

const stranka_scheme = joi.object({
    ime: joi.string().min(1).max(50).required(),
    priimek: joi.string().min(1).max(50),
    tel_st: joi.string().min(9).max(12).required(),
    naslov: joi.string()
})

const uporabnik_scheme = joi.object({
    uporabnisko_ime: joi.string().min(3).max(100).required(),
    geslo: joi.string().min(3).max(250).required(),
    id_podjetje: joi.string()
})

const rezervacija_scheme = joi.object({
    id_storitev: joi.string().required(),
    id_podjetje: joi.string().required(),
    datum: joi.date().required(),
    trajanje: joi.number().max(1440).required(),
    delo: joi.string().max(500).required(),

    ime_stranke: joi.string().alphanum(),
    priimek_stranke: joi.string().alphanum(),
    tel_st: joi.string().min(9).max(12),
    stranka: stranka_scheme,

}).xor('stranka', 'ime_stranke').with('ime_stranke', 'tel_st').with('ime_stranka','priimek_stranke');

exports.uporabnik_scheme = uporabnik_scheme;
exports.rezervacija_scheme = rezervacija_scheme;
exports.stranka_scheme = stranka_scheme;