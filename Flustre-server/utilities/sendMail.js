const { configDotenv } = require("dotenv");

configDotenv();

const crypto = require("crypto");
const nodemailer = require("nodemailer");

// const accountSid = process.env.TWILIO_SID;
// const authToken = process.env.TWILIO_TOKEN;
// const client = twilio(accountSid, authToken);

const generateOtp = () => crypto.randomInt(1000, 9999).toString();

// Build branded OTP email HTML
function buildOtpEmailHtml(otp) {
  const brandName = process.env.BRAND_NAME || "Flustre";
  const brandPrimary = process.env.BRAND_PRIMARY_COLOR || "#2B73B8";
  const brandAccent = process.env.BRAND_ACCENT_COLOR || "#3B8DD9";
  const logoUrl = process.env.BRAND_LOGO_URL || "";

  const headerTitle = brandName;
  const primaryColor = brandPrimary;
  const accentColor = brandAccent;

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
                  color: #333333;
                  margin: 0;
                  padding: 20px;
                  line-height: 1.6;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
              }
              .email-wrapper {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
              }
              .header-bg {
                  background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
                  padding: 32px 24px;
                  text-align: center;
              }
              .header-content {
                  color: #ffffff;
              }
              .logo {
                  height: 48px;
                  margin-bottom: 12px;
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
              }
              .brand-name {
                  font-size: 28px;
                  font-weight: 700;
                  color: #ffffff;
                  margin: 8px 0;
                  letter-spacing: -0.5px;
              }
              .subtitle {
                  font-size: 18px;
                  color: rgba(255, 255, 255, 0.95);
                  margin-top: 4px;
                  font-weight: 500;
              }
              .container {
                  padding: 40px 32px;
                  background: #ffffff;
              }
              .content {
                  text-align: center;
                  margin-bottom: 32px;
              }
              .intro-text {
                  font-size: 16px;
                  color: #4a5568;
                  margin-bottom: 24px;
                  line-height: 1.7;
              }
              .intro-text strong {
                  color: #2d3748;
                  font-weight: 600;
              }
              .otp-container {
                  margin: 32px 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 100%;
              }
              .otp-box {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: linear-gradient(135deg, #f0f7ff 0%, #e6f2ff 100%);
                  border: 2px solid ${primaryColor};
                  border-radius: 12px;
                  padding: 24px 40px;
                  box-shadow: 0 4px 12px rgba(43, 115, 184, 0.15);
                  width: 100%;
                  max-width: 280px;
                  margin: 0 auto;
              }
              .otp {
                  font-size: 42px;
                  font-weight: 700;
                  letter-spacing: 12px;
                  color: ${primaryColor};
                  font-family: 'Courier New', monospace;
                  text-align: center;
                  width: 100%;
                  margin: 0;
                  padding: 0;
                  line-height: 1;
              }
              .note {
                  font-size: 14px;
                  color: #718096;
                  margin-top: 24px;
                  line-height: 1.6;
                  padding: 16px;
                  background: #f7fafc;
                  border-radius: 8px;
                  border-left: 3px solid #cbd5e0;
              }
              .footer {
                  background: #f8f9fa;
                  padding: 24px 32px;
                  text-align: center;
                  border-top: 1px solid #e2e8f0;
              }
              .footer-text {
                  font-size: 14px;
                  color: #718096;
                  margin: 0;
              }
              .footer-brand {
                  color: ${primaryColor};
                  font-weight: 600;
              }
              .divider {
                  height: 1px;
                  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
                  margin: 24px 0;
              }
              @media only screen and (max-width: 600px) {
                  body {
                      padding: 10px;
                  }
                  .email-wrapper {
                      border-radius: 12px;
                  }
                  .header-bg {
                      padding: 24px 20px;
                  }
                  .brand-name {
                      font-size: 24px;
                  }
                  .subtitle {
                      font-size: 16px;
                  }
                  .container {
                      padding: 32px 24px;
                  }
                  .otp {
                      font-size: 36px;
                      letter-spacing: 8px;
                  }
                  .otp-box {
                      padding: 20px 32px;
                      max-width: 260px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-wrapper">
              <div class="header-bg">
                  <div class="header-content">
                      ${
                        logoUrl
                          ? `<img class="logo" src="${logoUrl}" alt="${headerTitle} logo" />`
                          : ""
                      }
                      <h1 class="brand-name">${headerTitle}</h1>
                      <div class="subtitle">Your OTP Code</div>
                  </div>
              </div>
              <div class="container">
                  <div class="content">
                      <p class="intro-text">
                          Use the following One-Time Password (OTP) to continue.
                          This code is valid for <strong>10 minutes</strong>.
                      </p>
                      <div class="otp-container">
                          <div class="otp-box">
                              <div class="otp">${otp}</div>
                          </div>
                      </div>
                      <p class="note">
                          If you did not request this code, you can safely ignore this email.
                      </p>
                  </div>
              </div>
              <div class="footer">
                  <p class="footer-text">
                      Thanks for using <span class="footer-brand">${brandName}</span>.
                  </p>
              </div>
          </div>
      </body>
      </html>
  `;
}
const otpToEmail = async (
  mail,
  customContent = null,
  customSubject = "Your OTP Code"
) => {
  const otp = generateOtp();

  let transpoter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_MAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.NODEMAILER_MAIL,
    to: mail,
    subject:
      customSubject || `Your ${process.env.BRAND_NAME || "Flustre"} OTP Code`,
    html: customContent || buildOtpEmailHtml(otp),
  };

  try {
    let info = await transpoter.sendMail(mailOptions);
    return [info.response, "OK", otp];
  } catch (err) {
    return [err, "Failed", null];
  }
};

module.exports = otpToEmail;
