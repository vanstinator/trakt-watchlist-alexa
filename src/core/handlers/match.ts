import AmazonDateParser from 'amazon-date-parser';

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

      // Look for an exact date match
      match.item = searchResponse.filter(item => `${item.movie.year}` === year)?.[0]?.movie;

      // Otherwise zoom out to the decade of the request
      if (!match.item) {
        const startYear = parseInt(`${(year || timeSeries).slice(0, 3)}0`);
        const endYear = startYear + 10;
        match.item = searchResponse.filter(item => item.movie.year <= endYear && item.movie.year >= startYear)?.[0].movie;
      }

    }

    if (!match.item) {
      // Our date parsing either found nothing or wasn't included in the utterance. Picking the first item
      match.item = searchResponse[0]?.movie;
    }
  } catch (e) {
    console.error(e);
  }

  return match;
};