import AmazonDateParser from 'amazon-date-parser';

import normalize from '../../helpers/normalize';
import { authenticatedClient } from '../services/got';
import { Match, MatchConfidence } from '../types';
import { TraktMovieSearchResponse } from '../types/trakt';

export default async (token: string, title: string, date?: string, timeSeries?: string): Promise<Match> => {

  const match: Match = { confidence: MatchConfidence.LOW };
  try {

    const searchResponse = await authenticatedClient(token)(`https://api.trakt.tv/search/movie?query=${title}`).json<TraktMovieSearchResponse[]>();

    if (date || timeSeries) {
      console.log('we got a date in our utterance. lets match the closest movie');
      const isYear = new RegExp(/^\d{4}$/).test(date);

      let year;
      if (isYear) {
        year = date;
      } else if (date) {
        // First parse a useable date
        const parsedDate: { startDate: Date, endDate: Date } = new AmazonDateParser(date);
        year = parsedDate.startDate.getFullYear;
      }

      const normalizedTitle = normalize(title);
      const candidateItems = searchResponse.filter(item => normalize(item.movie.title) === normalizedTitle || normalize(item.movie.title).includes(normalizedTitle));

      console.log(JSON.stringify(candidateItems, null, 2));
      // Look for an exact date match
      match.item = candidateItems.filter(item => `${item.movie.year}` === year)?.[0]?.movie;
      if (match.item) {
        match.confidence = MatchConfidence.HIGH;
      } else {
        // Otherwise zoom out to the decade of the request
        const startYear = parseInt(`${(year || timeSeries).slice(0, 3)}0`);
        const endYear = startYear + 10;
        match.item = candidateItems.filter(item => item.movie.year <= endYear && item.movie.year >= startYear)?.[0]?.movie;
      }

    }

    if (!match.item && (!date || !timeSeries)) {
      // Our date parsing either found nothing or wasn't included in the utterance. Picking the first item
      match.item = searchResponse[0]?.movie;
    }

  } catch (e) {
    console.error(e);
  }

  return match;
};