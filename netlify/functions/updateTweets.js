const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // use service role for writing
);

const BEARER_TOKEN = process.env.TWITTER_BEARER;
const userId = '1884945297526362112';

exports.handler = async function () {
  try {
    const { data: tweets } = await supabase
      .from('tweets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    const lastFetched = tweets?.[0]?.fetched_at;
    const isStale =
      !lastFetched ||
      Date.now() - new Date(lastFetched).getTime() > 24 * 60 * 60 * 1000;

    if (!isStale) {
      return {
        statusCode: 200,
        body: 'Tweets are up to date',
      };
    }

    const response = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,text,id,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url`,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
      }
    );

    const twitterData = await response.json();

    const mediaMap = {};
    if (twitterData.includes?.media) {
      for (const media of twitterData.includes.media) {
        mediaMap[media.media_key] = media.url || media.preview_image_url;
      }
    }

    const enrichedTweets = (twitterData.data || []).map((tweet) => {
      const images =
        tweet.attachments?.media_keys?.map((key) => mediaMap[key]).filter(Boolean) || [];
      return {
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        images,
        fetched_at: new Date().toISOString(),
      };
    });

    await supabase.from('tweets').delete().neq('id', '');
    await supabase.from('tweets').insert(enrichedTweets);

    return {
      statusCode: 200,
      body: 'Tweets updated successfully',
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error: ${err.message}`,
    };
  }
};
