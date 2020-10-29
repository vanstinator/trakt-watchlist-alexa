import got, { Got } from 'got';

const client = got.extend({
  headers: {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': process.env.TRAKT_CLIENT_ID,
  }
});

export default client;

export function authenticatedClient(token: string): Got {
  return client.extend({
    hooks: {
      beforeRequest: [
        options => {
          options.headers.Authorization = `Bearer ${token}`;
        }
      ]
    }
  });
}