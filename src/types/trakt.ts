export enum TraktMediaTypes {
  movie = 'movie',
  show = 'show',
  episode = 'episode',
  person = 'person',
  list = 'list'
}

export interface TraktMovieSearchResponse {
  type: TraktMediaTypes,
  score: number,
  movie: {
    title: string,
    year: number,
    ids: {
      trakt: number,
      slug: string,
      imdb: string,
      tmdb: number
    }
  }
}