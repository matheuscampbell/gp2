var mailer = require('nodemailer');
module.exports = class  {
    static async sendEmail(email, subject, message) {
        var transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'vraulissonteste@gmail.com',
                pass: 'Vrau123@'
            }
        });
        var mailOptions = {
            from: 'vraulissonteste@gmail.com',
            to: email,
            subject: subject,
            text: message
        };
        return await transporter.sendMail(mailOptions);
    }
}