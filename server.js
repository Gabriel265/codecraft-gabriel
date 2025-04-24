import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import cors from 'cors';

let cachedTweets = null;
let lastFetched = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes


dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());

const BEARER_TOKEN = process.env.TWITTER_BEARER;
const userId = '1884945297526362112'; // KadionSystems

app.get('/api/tutorial-tweets', async (req, res) => {
  const now = Date.now();

  if (cachedTweets && now - lastFetched < CACHE_DURATION) {
    console.log('✅ Using cached tweets');
    return res.json(cachedTweets);
  }

  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=20&tweet.fields=created_at,text,id,attachments&expansions=attachments.media_keys&media.fields=preview_image_url,url&exclude=`,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    console.log('📡 Twitter API response:', JSON.stringify(data, null, 2));

    // Handle rate limit
    if (response.status === 429 || !data.data) {
      return res.status(429).json({ error: 'Rate limit hit. Try again later.' });
    }

    const mediaMap = {};
    if (data.includes?.media) {
      for (const media of data.includes.media) {
        mediaMap[media.media_key] = media.url || media.preview_image_url;
      }
    }

    const enrichedTweets = (data.data || []).map(tweet => {
      const images = tweet.attachments?.media_keys?.map(key => mediaMap[key]).filter(Boolean) || [];
      return { ...tweet, images };
    });

    // Cache result
    cachedTweets = enrichedTweets;
    lastFetched = now;

    res.json(enrichedTweets);
  } catch (error) {
    console.error('Error fetching tweets:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
