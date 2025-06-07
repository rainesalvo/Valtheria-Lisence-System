

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ofraine:raine3131@ofraine.iqxn0tm.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const { Schema, model } = require('mongoose');

const coinSchema = new Schema({
  userID: { type: String, required: true },
  coins: { type: Number, default: 0 },
});

module.exports = model('Coin', coinSchema);