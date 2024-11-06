// /api/auth/twitter.js
import { URLSearchParams } from 'url';

export default async function handler(req, res) {
    const twitterAuthUrl = 'https://twitter.com/i/oauth2/authorize';
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: `${process.env.BASE_URL}/api/auth/callback`,
        scope: 'tweet.read tweet.write users.read offline.access',
        state: 'secureRandomState',  // Ensure a secure random string
        code_challenge: 'challenge',  // PKCE challenge (use hashed in production)
        code_challenge_method: 'plain'  // Use 'S256' for hashed challenge in production
    });

    res.json({ url: `${twitterAuthUrl}?${params.toString()}` });
}
