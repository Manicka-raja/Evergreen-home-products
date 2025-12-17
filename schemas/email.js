const nodemailer = require("nodemailer");

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(" ")[0];
    this.url = url; // This now contains the full link with the token
    this.from = `Manik <${process.env.MAIL_USER}>`;
  }

  createTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async send(subject, htmlContent) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: htmlContent,
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(
      "Welcome to Natural Food Family",
      `<div style="font-family: Arial, sans-serif;">
        <h2>Hello ${this.firstname}, 👋</h2>
        <p>Welcome to our Natural Food Family!</p>
        <a href="${this.url}">Visit Dashboard</a>
      </div>`
    );
  }

  async sendPasswordReset() {
    await this.send(
      "Your Password Reset Token (Valid for 10 mins)",
      `<div style="font-family: Arial, sans-serif;">
        <p>Hello ${this.firstname},</p>
        <p>Click the link below to reset your password:</p>
        
        <a href="${this.url}" style="color: blue;">Reset Password</a>
        
        <p>If you did not request this, ignore this email.</p>
      </div>`
    );
  }
}

module.exports = Email;
