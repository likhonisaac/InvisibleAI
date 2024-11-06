// api/auth/twitter.js
import { OAuth } from 'oauth';

export default async function handler(req, res) {
    const oauth = new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        process.env.TWITTER_CONSUMER_KEY,
        process.env.TWITTER_CONSUMER_SECRET,
        '1.0A',
        `${process.env.BASE_URL}/api/auth/callback`,
        'HMAC-SHA1'
    );

    oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret) => {
        if (error) {
            res.status(500).json({ error: 'Failed to initiate authentication' });
        } else {
            res.json({ url: `https://api.twitter.com/oauth/authorize?oauth_token=${oauth_token}` });
            // Store oauth_token_secret in memory or database temporarily if needed for callback
        }
    });
}
