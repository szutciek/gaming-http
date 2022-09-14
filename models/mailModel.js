const mongoose = require("mongoose");

const mailSchema = new mongoose.Schema({
  subscriber: [
    {
      mail: {
        type: String,
        required: true,
      },
      subscription: {
        type: String,
        required: true,
      },
      unsubscribeCode: {
        type: String,
        required: true,
        default: Math.random() * 9999,
      },
    },
  ],
});

const Mail = mongoose.model("Mail", mailSchema);

module.exports = Mail;
