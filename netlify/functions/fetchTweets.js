import fetch from 'node-fetch';

let cachedTweets = null;
let lastFetched = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const handler = async () => {
  const BEARER_TOKEN = process.env.TWITTER_BEARER;
  const userId = '1884945297526362112';

  const now = Date.now();
  if (cachedTweets && now - lastFetched < CACHE_DURATION) {
    console.log('✅ Serving from cache');
    return {
      statusCode: 200,
      body: JSON.stringify(cachedTweets),
    };
  }

  const res = await fetch(
    `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,text,id,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url`,
    {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    }
  );

  if (res.status === 429) {
    console.log('⚠️ Rate limit hit. Returning cached or empty data.');
    return {
      statusCode: 429,
      body: JSON.stringify(cachedTweets || []),
    };
  }

  const data = await res.json();

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

  // Cache them
  cachedTweets = enrichedTweets;
  lastFetched = now;

  return {
    statusCode: 200,
    body: JSON.stringify(enrichedTweets),
  };
};
