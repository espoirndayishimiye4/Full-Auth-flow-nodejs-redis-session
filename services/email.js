require("dotenv").config();
const nodemailer = require("nodemailer");

const sendAccountActivationEmail = (token, user) => {
  try {
    const link = `localhost:${process.env.PORT}/user/activate?token=${token}`;
    const htmlBody = `
    <html>
        <body>
            <span>
               <p>Hello,</p>
               <p>Please active your account by clicking this link <a href=${link}>${link}</a></p>
               </span>
        </body>
    </html>`;
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: `"Espoir work" ${process.env.USER}`,
      to: user.email,
      subject: "Activate your account",
      html: htmlBody,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      console.log(info.messageId);
      res.status(200).json({success:true})
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {sendAccountActivationEmail}
