const { OAuth2Client } = require("google-auth-library");
const { GOOGLE_CLIENT_ID } = require('../config/config.js');


const g_client = new OAuth2Client(GOOGLE_CLIENT_ID);
async function verifyGoogleToken(token) {
    const ticket = await g_client.verifyIdToken({
         idToken: token,
         audience: [GOOGLE_CLIENT_ID],  
    });
    return ticket.getPayload();
}

module.exports = { verifyGoogleToken };//lol, soft yield