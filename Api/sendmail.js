var env = require('./environment');
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    // port: 25,
    auth: {
        user: 'mandarexceptionaire@gmail.com',
        pass: '9422104009'
    }
});

exports.sendmail = function(usermail, mailmatter, subject) {

    var mailOptions = {
        from: 'Sushant<sushant@gmail.com>',
        to: usermail,
        subject: subject,
        html: mailmatter
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info);
        }
    });

}
