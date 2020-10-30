import normalize from '../helpers/normalize';
import { authenticatedClient } from '../services/got';
import { Match, MatchConfidence } from '../types';
import { TraktMovieSearchResponse } from '../types/trakt';
import logger from '../utils/logger';

const log = logger.category('MATCH');

export default async (token: string, title: string, year?: string, timeSeries?: string): Promise<Match> => {

  const match: Match = { confidence: MatchConfidence.LOW };
  try {

    const searchResponse = await authenticatedClient(token)(`https://api.trakt.tv/search/movie?query=${title}`).json<TraktMovieSearchResponse[]>();

    const normalizedTitle = normalize(title);
    const candidateItems = searchResponse.filter(item => normalize(item.movie.title) === normalizedTitle || normalize(item.movie.title).includes(normalizedTitle));
    searchResponse.forEach(item => log.debug(`Match Candidate ${normalize(item.movie.title)}`));
    log.debug(`Requested Title ${normalizedTitle}`);

    if (year) {
      match.item = candidateItems.filter(item => `${item.movie.year}` === year)?.[0]?.movie;
      if (match.item && normalize(match.item.title) === normalizedTitle) {
        match.confidence = MatchConfidence.HIGH;
      }
    }

    // TODO we probably want to not fuzzy match a year without disambiguating in the future
    if (year || timeSeries) {
      const startYear = parseInt(`${(year || timeSeries).slice(0, 3)}0`);
      const endYear = startYear + 10;
      match.item = candidateItems.filter(item => item.movie.year <= endYear && item.movie.year >= startYear)?.[0]?.movie;
    }

    if (!match.item && (!year && !timeSeries)) {
      // Our date parsing either found nothing or wasn't included in the utterance. Picking the first item
      match.item = searchResponse[0]?.movie;
    }

  } catch (e) {
    console.error(e);
  }

  return match;
};