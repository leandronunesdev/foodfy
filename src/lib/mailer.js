const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '7f7c5a3bc07291',
    pass: 'f7a2e9a42d86ec',
  },
});
