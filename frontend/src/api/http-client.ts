const BASE_URL =
  process.env['NODE_ENV'] === 'production' ? 'https://scrumpoker-rails.herokuapp.com/' : 'http://localhost:3000/';
export default function api(url: string, options: RequestInit = {}) {
  options.headers = { ...options.headers, 'Content-Type': 'application/json' };
  return fetch(BASE_URL + url, options)
    .then(async (response) => {
      if (!response.ok) {
        const res = await response.json();
        throw res;
      }
      return response;
    })
    .then((response) => response.json());
}
