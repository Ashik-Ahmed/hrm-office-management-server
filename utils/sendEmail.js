const nodemailer = require('nodemailer');

exports.sendEmail = async (emailInfo) => {
    // Create a transporter using Zimbra settings
    try {
        const transporter = nodemailer.createTransport({
            host: 'mail.colocity.host',
            port: 587, // outgoing port for mail server
            secure: false, // Set to true for secure connections like TLS, false for non-secure
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Message object
        const message = {
            from: process.env.AUTH_EMAIL,
            to: emailInfo.to,
            subject: emailInfo.subject,
            html: emailInfo.body
            // text: 'This is a test email sent from Node.js using Nodemailer and Zimbra.',
            // html: '<p>This is a test email sent from <strong>Node.js</strong> using <em>Zimbra</em>.</p>',
        };

        // Send the email
        const emailStatus = await transporter.sendMail(message);

        return emailStatus

    } catch (error) {
        console.log('Error: ', error);
        return error;
    }
}
