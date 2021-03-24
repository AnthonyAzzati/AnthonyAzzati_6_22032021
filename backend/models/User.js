const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// schema mongoDb pour les utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// permet de vérifier un email unique par utilisateur
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
