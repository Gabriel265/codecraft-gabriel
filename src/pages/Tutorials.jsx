import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Setup your Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Tutorials() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTweets() {
      try {
        const { data, error } = await supabase
          .from('tweets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTweets(data || []);
      } catch (err) {
        console.error('Error loading tweets', err);
      } finally {
        setLoading(false);
      }
    }

    loadTweets();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6">📘 Tutorials Hub</h2>

      {loading && <p className="text-gray-400">Loading tweets...</p>}
      {!loading && tweets.length === 0 && (
        <p className="text-gray-400">No tweets found. Come back soon!</p>
      )}

      <div className="space-y-6">
        {tweets.map(tweet => (
          <div key={tweet.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow-md">
            <p className="text-md whitespace-pre-line">{tweet.text}</p>

            {tweet.images?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {tweet.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Tweet media"
                    className="rounded-lg w-full h-auto max-h-60 object-cover"
                  />
                ))}
              </div>
            )}

            <a
              href={`https://twitter.com/KadionSystems/status/${tweet.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-500 dark:text-blue-300 hover:underline"
            >
              View on Twitter →
            </a>

            <p className="text-sm text-gray-500 mt-1">
              {new Date(tweet.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
