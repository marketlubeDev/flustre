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
  const brandName = process.env.BRAND_NAME || "Souqalmart";
  const brandPrimary = process.env.BRAND_PRIMARY_COLOR || "#6D0D26";
  const brandAccent = process.env.BRAND_ACCENT_COLOR || "#f59e0b"; // amber-500
  const logoUrl = process.env.BRAND_LOGO_URL || "";

  const headerTitle = brandName;

  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f6f7f9;
                  color: #111827;
                  margin: 0;
                  padding: 0;
                  line-height: 1.6;
              }
              .container {
                  max-width: 600px;
                  margin: 32px auto;
                  background: #ffffff;
                  padding: 24px;
                  border-radius: 12px;
                  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
              }
              .header {
                  text-align: center;
                  padding: 4px 0 16px 0;
                  border-bottom: 1px solid #eef2f7;
                  margin-bottom: 20px;
              }
              .brand-name {
                  font-size: 22px;
                  font-weight: 800;
                  color: ${brandPrimary};
                  margin: 0;
              }
              .subtitle {
                  font-size: 16px;
                  color: #374151;
                  margin: 8px 0 0 0;
                  font-weight: 600;
              }
              .content {
                  margin: 16px 0 24px 0;
                  font-size: 15px;
                  color: #374151;
                  text-align: center;
              }
              .otp {
                  display: inline-block;
                  font-size: 34px;
                  letter-spacing: 6px;
                  font-weight: 800;
                  color: ${brandAccent};
                  background: #fff7ed;
                  border: 1px dashed ${brandAccent};
                  border-radius: 10px;
                  padding: 12px 18px;
                  margin: 14px 0;
              }
              .note {
                  font-size: 13px;
                  color: #6b7280;
              }
              .footer {
                  text-align: center;
                  font-size: 12px;
                  color: #6b7280;
                  border-top: 1px solid #eef2f7;
                  padding-top: 16px;
              }
              .logo {
                  height: 36px;
                  margin-bottom: 6px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  ${
                    logoUrl
                      ? `<img class="logo" src="${logoUrl}" alt="${headerTitle} logo" />`
                      : ""
                  }
                  <h1 class="brand-name">${headerTitle}</h1>
                  <div class="subtitle">Your OTP Code</div>
              </div>
              <div class="content">
                  <p>Use the following One-Time Password (OTP) to continue. This code is valid for <strong>10 minutes</strong>.</p>
                  <div class="otp">${otp}</div>
                  <p class="note">If you did not request this code, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                  <p>Thanks for using ${brandName}.</p>
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
      customSubject || `Your ${process.env.BRAND_NAME || "SukalMart"} OTP Code`,
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
