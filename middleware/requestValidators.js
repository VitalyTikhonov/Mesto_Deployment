const { isCelebrateError } = require('celebrate');

module.exports = (err, req, res, next) => {
  if (!isCelebrateError(err)) {
    return next(err);
  }
  const arrayFromCelebErrObjMap = Object.fromEntries(err.details);
  const arrayFromCelebErrObj = Object.entries(arrayFromCelebErrObjMap);
  const celebFieldsArr = [];
  const celebMessagesArr = [];
  // eslint-disable-next-line array-callback-return
  arrayFromCelebErrObj.map((reqSeg) => {
    const arrayFromSegmentObj = Object.entries(reqSeg[1]);
    const arrayfromErrObj = arrayFromSegmentObj[1][1];

    const celebFields = arrayfromErrObj.map((errObj) => errObj.context.label).join(', ');
    celebFieldsArr.push(celebFields);

    const celebMessages = arrayfromErrObj.map((errObj) => errObj.message).join('; ');
    celebMessagesArr.push(celebMessages);
  });
  const allCelebFields = celebFieldsArr.join(', ');
  const allCelebMessages = celebMessagesArr.join('; ');
  const returnedErr = new Error();
  returnedErr.statusCode = 400;
  returnedErr.message = `Следующие поля заполнены неверно: ${allCelebFields}. Подробнее: ${allCelebMessages}`;
  return next(returnedErr);
};

/* Простите, психанул… */
