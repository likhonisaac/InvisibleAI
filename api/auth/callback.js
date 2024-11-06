// api/auth/callback.js
import { OAuth } from 'oauth';
import { supabase } from './supabaseClient';  // Supabase setup for user data storage

export default async function handler(req, res) {
    const { oauth_token, oauth_verifier } = req.query;

    const oauth = new OAuth(
        'https://api.twitter.com/oauth/request_token',
        'https://api.twitter.com/oauth/access_token',
        process.env.TWITTER_CONSUMER_KEY,
        process.env.TWITTER_CONSUMER_SECRET,
        '1.0A',
        `${process.env.BASE_URL}/api/auth/callback`,
        'HMAC-SHA1'
    );

    oauth.getOAuthAccessToken(oauth_token, null, oauth_verifier, async (error, access_token, access_token_secret, results) => {
        if (error) {
            res.status(500).json({ error: 'Authentication failed' });
        } else {
            const { user_id, screen_name } = results;

            // Save access_token, access_token_secret, and email (if available)
            await supabase.from('user_tokens').upsert({
                user_id,
                screen_name,
                access_token,
                access_token_secret,
                email: results.email || ''
            });

            // Redirect user to main page after successful authentication
            res.redirect('/');
        }
    });
}
