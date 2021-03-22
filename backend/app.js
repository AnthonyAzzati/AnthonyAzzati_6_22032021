const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Sauce = require("./models/Sauce");

mongoose
  .connect(
    "mongodb+srv://ADMIN:DlicDhhIfqvb4wtG@cluster0.rs6ub.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());

app.post("/api/sauces", (req, res, next) => {
  delete req.body._id;
  const sauce = new Sauce({
    ...req.body,
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: "Sauce correctement enregistrée" })
    )
    .catch((error) => res.status(400).json({ error }));
});

module.exports = app;
