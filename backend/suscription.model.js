const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Suscription = new Schema({
    endpoint: {
        type: String,
        required: true
    },
    expirationTime: {
        type: Date,
        default: null
    },
    keys: {
        p256dh: {
            type: String,
            required: true
        },
        auth: {
          type: String,
          required: true
        }
    }
});

module.exports = mongoose.model('Suscription', Suscription)