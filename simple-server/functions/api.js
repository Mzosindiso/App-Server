const { handler } = require('../server');

exports.handler = async (event, context) => {
  return handler(event, context);
};