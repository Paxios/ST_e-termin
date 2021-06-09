const express = require('express');
const database = require('../database/dao')
const verifikacija = require('../verification/verification')
const security = require('../security/security')
var router = express.Router();

//POST Register a new user
router.post("/register", async (req, res) => {
  const { error } = verifikacija.uporabnik_scheme.validate(req.body)
  if (error != null) {
    res.status(400).json({ status: "error", reason: error })
    return
  }
  new_user = await database.register(req.body)
  if ("code" in new_user) {
    res.status(new_user.code).json({ status: new_user.status, reason: new_user.reason })
  }
  else {
    res.json({ status: "OK" })
  }
});

//POST login
router.post("/login", async (req, res) => {

  if (!(("uporabnisko_ime" in req.body) || ("geslo" in req.body))) {
    res.status(400).json({ status: "ERROR", code: 401, reason: "missing arguments" })
    return
  }

  const user = await database.getUserByUsername(req.body.uporabnisko_ime)

  if (user != null) {
    const isCorrect = security.check_password_with_hash(req.body.geslo, user.geslo)
    if (isCorrect) {
      const token = security.createJWT(user)
      res.set("Authorization", `Bearer ${token}`)
      res.json({ authenticated: isCorrect });
    }
    else {
      res.status(401).json({ status: "ERROR", code: 401, reason: "Invalid username or password" })
    }
  }
  else {
    res.status(401).json({ status: "ERROR", code: 401, reason: "Invalid username or password" })
  }
});

router.delete("/", async (req, res) => {

  console.log(req.body)
  if (!("uporabnisko_ime" in req.body)) {
    res.status(400).json({ status: "ERROR", code: 401, reason: "missing arguments" })
    return
  }

  database.deleteUser(req.body.uporabnisko_ime).then(resp => {
    res.json({ status: "SUCCESS", reason: "User deleted successfully" })
  }).catch(error => {
    res.status(400).json({ status: "ERROR", reason: error })
  });
});


module.exports = router;
