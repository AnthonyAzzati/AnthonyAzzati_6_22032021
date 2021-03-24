"use strict";

const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

// routes liées à l'inscription et connexion utilisateur
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
