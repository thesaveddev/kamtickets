const nodemailer = require('nodemailer');

exports.sendMail = async (account, mailOptions) => {
    try {
          // create transporter and authenticate user mail address
          let transporter = nodemailer.createTransport({
            service: "gmail",
            host: account.smtp_server,
            port: account.port,
            secure: false,
            auth: {
              user: account.smtp_username,
              pass: account.smtp_password
            },
          });
      await transporter.verify(mailOptions, async (error, info) => {
            if (error) {
              console.log(error);
            } 
              console.log('mail sent');
          });
    } catch (err) {
      console.log(err)
      console.log('mail not sent')
    }
}

exports.validateSMTP = async (account, mailOptions) => {
          // create transporter and authenticate user mail address
          let transporter = nodemailer.createTransport({
            service: account.smtp_username.split('@')[1].split('.')[0],
            host: account.smtp_server,
            port: account.port,
            secure: false,
            auth: {
              user: account.smtp_username,
              pass: account.smtp_password
            },
          });
  
          transporter.verify(function(error, success) {
          if (error) {
            console.log(error);
          } else {
            return true
          }
        });
}