const nodemailer = require('nodemailer');

// Create a transporter using Zimbra settings
const transporter = nodemailer.createTransport({
    host: 'mail.colocity.host',
    port: 587, // Use the appropriate port for your server
    secure: false, // Set to true for secure connections like TLS, false for non-secure
    auth: {
        user: 'ashik@infotelebd.com',
        pass: 'Itbl@it321',
    },
});

// Message object
const message = {
    from: 'ashik@infotelebd.com',
    to: 'mushfiq@infotelebd.com',
    subject: 'Hello from Node.js!',
    text: 'This is a test email sent from Node.js using Nodemailer and Zimbra.',
    html: '<p>This is a test email sent from <strong>Node.js</strong> using <em>Zimbra</em>.</p>',
};

// Send the email
transporter.sendMail(message, (error, info) => {
    if (error) {
        console.error('Error occurred:', error.message);
        return;
    }
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
});
