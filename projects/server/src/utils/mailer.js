const nodemailer = require("nodemailer");

module.exports = {
  sendEmail: ({
    recipient_email,
    subject,
    receiver,
    message = "Congrats! Now you are registered. Looking forward for your interesting journey of the perfume world",
  }) => {
    return new Promise((resolve, reject) => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASSWORD,
        },
      });

      const mail_configs = {
        from: process.env.MY_EMAIL,
        to: recipient_email,
        subject: `${subject}`,
        html: `
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>B•U</title>
</head>
<body>
<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #187BCD;text-decoration:none;font-weight:600">B•U</a>

    </div>
    <p style="font-size:1.1em">Hi, ${receiver}</p>
    <p>${message}</p>
    <p style="font-size:0.9em;">Regards,<br />B•U PERFUME</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>B•U PERFUME</p>
      <p>B•U</p>
      <p>Special Capital Region of Jakarta</p>
    </div>
  </div>
</div>
  
</body>
</html>`,
      };
      transporter.sendMail(mail_configs, function (error, info) {
        if (error) {
          return reject({ message: `An error has occured` });
        }
        return resolve({ message: "Email sent succesfuly" });
      });
    });
  },
};
