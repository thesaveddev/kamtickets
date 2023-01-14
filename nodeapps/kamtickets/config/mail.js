const nodemailer = require('nodemailer');

exports.sendMail = async (mail) => {
    const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'linkhopey@gmail.com',
        pass: 'h0pe%l0ve'
    }
});

let mailOptions = {
    from: 'Peopliva',
    to: mail.to,
    subject: mail.subject,
    text: mail.text
};

    await transporter.sendMail(mailOptions).then(sentMail => {
    console.log('mail sent')
    }).catch(err => {
    console.log(err)
})
}