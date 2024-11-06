// /api/auth/callback.js
import axios from 'axios';

export default async function handler(req, res) {
    const { code, state } = req.query;

    try {
        const response = await axios.post(
            'https://api.twitter.com/2/oauth2/token',
            new URLSearchParams({
                client_id: process.env.TWITTER_CLIENT_ID,
                client_secret: process.env.TWITTER_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
                code_verifier: 'challenge'  // Use the same code_verifier sent initially
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token, refresh_token } = response.data;

        // Save tokens (in a real app, save to a database instead)
        await saveUserTokens({ access_token, refresh_token });

        // Redirect to the main page after successful authentication
        res.redirect('/');
    } catch (error) {
        console.error('Error obtaining access token:', error);
        res.status(500).json({ error: 'Failed to authenticate' });
    }
}

// Mock function for saving user tokens - replace with actual database logic
async function saveUserTokens({ access_token, refresh_token }) {
    console.log('Saving tokens:', { access_token, refresh_token });
    // Implement your database logic here
}
