function getOTPEmailHtml(name, otp) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification - Placements Drive</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                text-align: center;
                padding: 20px;
                border-radius: 5px 5px 0 0;
            }
            .content {
                background-color: #f9f9f9;
                padding: 20px;
                border-radius: 0 0 5px 5px;
            }
            .otp-box {
                background-color: #e9e9e9;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
                text-align: center;
                font-size: 2em;
                letter-spacing: 8px;
                font-weight: bold;
            }
            .notice {
                margin-top: 20px;
                color: #555;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #aaa;
              margin-top: 20px;
              padding: 20px;
          }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Placement Cell Email Verification</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for signing up for Placements Cell — your placement management system. Please verify your email address by entering the OTP below:</p>
            <div class="otp-box">${otp}</div>
            <div class="notice">
                <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
            <p>Best regards,<br>The Placements Team</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Placements Cell. All rights reserved.
      </div>
    </body>
    </html>`;
}

module.exports = getOTPEmailHtml; 