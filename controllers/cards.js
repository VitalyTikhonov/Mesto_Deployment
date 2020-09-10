const mongoose = require('mongoose');
const Card = require('../models/card');
const { isObjectIdValid } = require('../helpers/helpers');

const NoDocsError = require('../errors/NoDocsError');
const DocNotFoundError = require('../errors/DocNotFoundError');
const InvalidInputError = require('../errors/InvalidInputError');
const NoRightsError = require('../errors/NoRightsError');

function getAllCards(req, res, next) {
  Card.find({})
    .orFail(new NoDocsError('card'))
    .then((respObj) => res.send(respObj))
    .catch(next);
}

function createCard(req, res, next) {
  try {
    const owner = req.user._id; // не менять owner на user!
    const { name, link } = req.body;
    Card.create({ name, link, owner })
      .then((respObj) => res.send(respObj))
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          next(new InvalidInputError(err));
        }
      });
  } catch (err) {
    next(err);
  }
}

function deleteCard(req, res, next) {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;
    isObjectIdValid(cardId, 'card');
    Card.findById(cardId)
      .orFail(new DocNotFoundError('card'))
      .then((respObj) => {
        if (respObj.owner.equals(userId)) {
          respObj.deleteOne()
            .then((deletedObj) => res.send(deletedObj));
        } else {
          next(new NoRightsError());
        }
      })
      .catch(next);
  } catch (err) {
    next(err);
  }
}

function toggleCardLike(req, res, next) {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;
    isObjectIdValid(cardId, 'card');
    let action;
    switch (req.method) {
      case 'PUT':
        action = '$addToSet';
        break;
      case 'DELETE':
        action = '$pull';
        break;
      default:
    }
    Card.findByIdAndUpdate(
      cardId,
      { [action]: { likes: userId } },
      { new: true },
    )
      .orFail(new DocNotFoundError('card'))
      .then((respObj) => res.send(respObj))
      .catch(next);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  toggleCardLike,
};
