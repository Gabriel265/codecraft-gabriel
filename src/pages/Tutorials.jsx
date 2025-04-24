import { useEffect, useState } from 'react';

export default function Tutorials() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
  fetch('/.netlify/functions/fetchTweets')
    .then(res => res.json())
    .then(setTweets)
    .catch(err => console.error('Error loading tweets', err));
}, []);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6">📘 Tutorials Hub</h2>

      {tweets.length === 0 && (
        <p className="text-gray-400">No tutorial tweets found yet.</p>
      )}

      <div className="space-y-6">
        {tweets.map(tweet => (
          <div key={tweet.id} className="bg-white dark:bg-gray-800 p-5 rounded shadow-md">
            <p className="text-md whitespace-pre-line">{tweet.text}</p>

            {tweet.images.length > 0 && (
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
