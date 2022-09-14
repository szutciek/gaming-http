const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kanapkobot@gmail.com",
    pass: process.env.EMAIL_PWD,
  },
});

exports.subToNews = async (req, res, next) => {
  try {
    const mailOptions = {
      from: "kanapkobot@gmail.com",
      to: req.body.subscriber,
      subject: "Kanapka Studios Subscription",
      html: `<h1>WELCOME ${req.body.subscriber.split("@")[0]}</h1>
                <h3>You have subscribed to the Kanapka Studios Official News Feed (KSONF)!</h3>
                <h5 style="margin: 0 auto;">THANK YOU FOR YOUR SUPPORT!</h5>
                <p style="margin-top: 300px">This message was generated automatically. Do not bother to respond</p>
                `,
    };

    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
        res.json({ message: "Failed to send mail" });
      } else {
        res.json({
          message: `Mail successfully sent to ${req.body.subscriber}`,
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.subToInvs = async (req, res, next) => {
  try {
    const mailOptions = {
      from: "kanapkobot@gmail.com",
      to: req.body.subscriber,
      subject: "Kanapka Studios Subscription",
      html: `<h1>WELCOME ${req.body.subscriber.split("@")[0]}</h1>
        <h3>You have subscribed to the Kanapka Studios Official Invitation Feed (KSONF)!</h3>
        <h4>You will be recieving email like this when someone invites you to a game (Not avalible yet).</h4>
        <h5>THANK YOU FOR YOUR SUPPORT!</h5>
        <p style="margin-top: 300px">This message was generated automatically. Do not bother to respond</p>
        `,
    };

    await transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        res.json({ message: "Failed to send mail" });
      } else {
        res.json({ message: "Mail sent" });
      }
    });
  } catch (err) {
    next(err);
  }
};
