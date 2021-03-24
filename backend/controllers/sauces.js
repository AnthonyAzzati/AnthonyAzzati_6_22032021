const Sauce = require("../models/Sauce");
const fs = require("fs");

// fonction qui comptabilise un like
const addLike = (res, sauceId, userId) => {
  Sauce.updateOne(
    { _id: sauceId },
    {
      $inc: { likes: 1 },
      $push: { usersLiked: userId },
    }
  )
    .then(() => res.status(200).json({ message: "Sauce liké" }))
    .catch((error) => res.status(400).json({ error }));
};

// fonction qui comptabilise un dislike
const addDislike = (res, sauceId, userId) => {
  Sauce.updateOne(
    { _id: sauceId },
    {
      $inc: { dislikes: 1 },
      $push: { usersDisliked: userId },
    }
  )
    .then(() => res.status(200).json({ message: "Sauce non liké" }))
    .catch((error) => res.status(400).json({ error }));
};

// fonction qui met à jour le compteur de likes
const updateLikes = (res, sauceId, userId) => {
  Sauce.findById({ _id: sauceId })
    .then((sauce) => {
      if (sauce.usersLiked.includes(userId)) {
        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { likes: -1 },
            $pull: { usersLiked: userId },
          }
        )
          .then(() => res.status(200).json({ message: "Mis à jour" }))
          .catch((error) => res.status(400).json({ error }));
      }

      if (sauce.usersDisliked.includes(userId)) {
        Sauce.updateOne(
          { _id: sauceId },
          {
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId },
          }
        )
          .then(() => res.status(200).json({ message: "Mis à jour" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

// middleware pour créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: "Sauce correctement enregistrée" })
    )
    .catch((error) => res.status(400).json({ error }));
};

// middleware pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// middleware pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// middleware pour récupérer une sauce en fonction de son :id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// middleware pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// middleware pour appliquer les likes aux sauces
exports.likes = (req, res, next) => {
  const userId = req.body.userId;
  const sauceId = req.params.id;

  switch (req.body.like) {
    case 1:
      addLike(res, sauceId, userId);
      break;
    case -1:
      addDislike(res, sauceId, userId);
      break;
    case 0:
      updateLikes(res, sauceId, userId);
      break;
  }
};
