const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ofraine:raine3131@ofraine.iqxn0tm.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const kayitSchema = new Schema({
  userID: { type: String, required: true },
  kayits: { type: Number, default: 0 },
});

module.exports = model('Kayit', kayitSchema);
