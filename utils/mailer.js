const nodemailer = require("nodemailer");

exports.sendMail = async (mailOptions) => {
  console.log('sending mail');

  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "it-helpdesk@kamholding.net", // generated ethereal user
      pass: "Wag48043", // generated ethereal password
    },
  });

  // send mail with defined transport object
  await transporter.sendMail(mailOptions ).then(info => {
    console.log("mail sent")
  }).catch(err => {
    console.log(err)
  })

  // console.log("Message sent: %s", info.messageId);
}