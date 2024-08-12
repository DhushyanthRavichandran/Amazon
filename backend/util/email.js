const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
    try {
        // Ensure all necessary environment variables are defined
        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM_NAME || !process.env.SMTP_FROM_EMAIL) {
            throw new Error('Missing required environment variables for SMTP configuration');
        }

        const transport = {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            logger: true, // Enable logging
            debug: true // Show debug output
        };

        const transporter = nodemailer.createTransport(transport);

        const message = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

         transporter.sendMail(message, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
          });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

module.exports = sendEmail;