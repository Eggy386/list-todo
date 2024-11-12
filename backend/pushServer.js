const webpush = require('web-push');
const keys = require('./keys.json')

webpush.setVapidDetails(
    'mailto:edgar.alvarado.21s@utzmg.edu.mx',
    keys.publicKey,
    keys.privateKey
);

function sendPush(pushSubscription, message) {
    const payload = JSON.stringify({
        title: 'Nueva tarea',
        body: message
    });
    return webpush.sendNotification(pushSubscription, payload);
}


module.exports = { sendPush };