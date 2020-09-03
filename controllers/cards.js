const Card = require('../models/card');
const {
  createDocHandler,
  getAllDocsHandler,
  getLikeDeleteHandler,
  errors,
  isUserExistent,
  isObjectIdValid,
} = require('../helpers/helpers');

function getAllCards(req, res) {
  getAllDocsHandler(Card.find({}), req, res);
}

function createCard(req, res) {
  try {
    const owner = req.user._id; // не менять owner на user!
    isObjectIdValid(owner, 'user');
    const { name, link } = req.body;
    isUserExistent(owner)
      .then((checkResult) => {
        if (checkResult) {
          createDocHandler(Card.create({ name, link, owner }), req, res, 'card');
        } else {
          throw new Error();
        }
      })
      .catch(() => res.status(404).send({ message: `${errors.byDocType.user}` }));
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

function deleteCard(req, res) {
  try {
    const userId = req.user._id;
    isObjectIdValid(userId, 'user');
    const { cardId } = req.params;
    isObjectIdValid(cardId, 'card');
    isUserExistent(userId)
      .then((checkResult) => {
        if (checkResult) {
          getLikeDeleteHandler(Card.findById(cardId), req, res, 'card', userId);

          /* Так работало, но зачем */
          // getLikeDeleteHandler(Card.findById({ _id: cardId }), req, res, 'card', userId);

          /* Так работало, но не давало проверить владельца для дифференциации ошибок */
          // getLikeDeleteHandler(Card.findO
          // neAndRemove({ _id: cardId, owner: userId }), req, res, 'card');
        } else {
          throw new Error();
        }
      })
      .catch(() => res.status(404).send({ message: `${errors.byDocType.user}` }));
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

function likeCard(req, res) {
  try {
    const userId = req.user._id;
    isObjectIdValid(userId, 'user');
    const { cardId } = req.params;
    isObjectIdValid(cardId, 'card');
    isUserExistent(userId)
      .then((checkResult) => {
        if (checkResult) {
          getLikeDeleteHandler(Card.findByIdAndUpdate(
            cardId,
            { $addToSet: { likes: userId } },
            { new: true },
          ), req, res, 'card');
        } else {
          throw new Error();
        }
      })
      .catch(() => res.status(404).send({ message: `${errors.byDocType.user}` }));
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

function unlikeCard(req, res) {
  try {
    const userId = req.user._id;
    isObjectIdValid(userId, 'user');
    const { cardId } = req.params;
    isObjectIdValid(cardId, 'card');
    isUserExistent(userId)
      .then((checkResult) => {
        if (checkResult) {
          getLikeDeleteHandler(Card.findByIdAndUpdate(
            cardId,
            { $pull: { likes: userId } },
            { new: true },
          ), req, res, 'card');
        } else {
          throw new Error();
        }
      })
      .catch(() => res.status(404).send({ message: `${errors.byDocType.user}` }));
  } catch (err) {
    res.status(400).send({ message: `${errors.objectId[err.docType]}` });
  }
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
