import got from '../services/got';

export default async (tmdbId: string | number): Promise<string> => {
  const client = got.extend({
    // unset trakt headers
    headers: undefined
  });

  const response = await client(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=4e34fc5d4f94dc1ca52563dd3f332760`).json();

  // @ts-expect-error fully type this response at some point
  return `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${response.poster_path}`;
};