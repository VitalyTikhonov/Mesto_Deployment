const { CORS_ORIGINS } = require('../configs/config');

module.exports.corsOptions = {
  origin: CORS_ORIGINS,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  allowedHeaders: [
    'Content-Type',
    'origin',
    'x-access-token',
  ],
  credentials: true,
};
