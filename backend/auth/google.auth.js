const { OAuth2Client } = require("google-auth-library");
const { GOOGLE_CLIENT_ID } = require('../config/config.js');


const g_client = new OAuth2Client(GOOGLE_CLIENT_ID);
async function verifyGoogleToken(token) {
    try {
        console.log("Verifying token with Client ID:", GOOGLE_CLIENT_ID);
        const ticket = await g_client.verifyIdToken({
            idToken: token,
            audience: [GOOGLE_CLIENT_ID],
        });
        const payload = ticket.getPayload();
        console.log("Token verified. User:", payload.email);
        return payload;
    } catch (error) {
        console.error("Google Verify Error:", error.message);
        return null;
    }
}

module.exports = { verifyGoogleToken };//lol, soft yield