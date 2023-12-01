const nodemailer = require('nodemailer');

module.exports = async (req, res, next) => {
    // Create a transporter using Zimbra settings
    try {
        const transporter = nodemailer.createTransport({
            host: 'mail.colocity.host',
            port: 587, // Use the appropriate port for your server
            secure: false, // Set to true for secure connections like TLS, false for non-secure
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.EMAIL_PASSWORD,
                // user: 'office@infotelebd.com',
                // pass: 'Itbl@it321',
            },
        });

        // Message object
        const message = {
            from: 'obaydul@infotelebd.com',
            to: 'ashik@infotelebd.com',
            subject: 'Hello from Node.js!',
            text: 'This is a test email sent from Node.js using Nodemailer and Zimbra.',
            html: '<p>This is a test email sent from <strong>Node.js</strong> using <em>Zimbra</em>.</p>',
        };

        // Send the email
        const emailStatus = transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error('Error occurred:', error);
                return;
            }
            console.log('Email sent successfully!');
            console.log('Message ID:', info.messageId);
        });

        next()

    } catch (error) {
        console.log('Error: ', error);
    }
}
