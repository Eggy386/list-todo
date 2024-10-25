const webpush = require('web-push');
const keys = require('./keys.json')

webpush.setVapidDetails(
    'mailto:edgar.alvarado.21s@utzmg.edu.mx',
    keys.publicKey,
    keys.privateKey
);

function sendPush(pushSubscription) {

    // Asegúrate de devolver la promesa
    return webpush.sendNotification(pushSubscription, 'Luis es gay')
}


module.exports = { sendPush };