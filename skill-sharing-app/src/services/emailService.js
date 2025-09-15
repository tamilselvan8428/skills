const nodemailer = require('nodemailer');

const emailService = {
    transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }),

    sendEmail: async (to, subject, text) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        try {
            await emailService.transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    },

    sendGMeetLink: async (to, skillName, gmeetLink) => {
        const subject = `New GMeet Link for ${skillName}`;
        const text = `You have expressed interest in learning ${skillName}. Here is the GMeet link: ${gmeetLink}`;
        await emailService.sendEmail(to, subject, text);
    },

    notifyNewSession: async (to, skillName) => {
        const subject = `New Session Available for ${skillName}`;
        const text = `A new session for ${skillName} is now available. Check your dashboard for more details.`;
        await emailService.sendEmail(to, subject, text);
    },
};

module.exports = emailService;