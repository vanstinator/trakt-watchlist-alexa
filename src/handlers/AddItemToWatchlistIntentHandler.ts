import AmazonDateParser from 'amazon-date-parser';
import * as Alexa from 'ask-sdk';
import { Response } from 'ask-sdk-model';
import { parse } from 'date-fns';

import { SLOTS } from '../constants/slots';
import { authenticatedClient } from '../services/got';
import { STRINGS } from '../strings';
import { HandlerInput } from '../types/alexa';
import { TraktMovieSearchResponse } from '../types/trakt';

export default {

  canHandle(handlerInput: HandlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AddItemToWatchlistIntent';
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {

    const token = Alexa.getAccountLinkingAccessToken(handlerInput.requestEnvelope);

    const movieSlot = Alexa.getSlotValue(handlerInput.requestEnvelope, SLOTS.MOVIE);
    const dateSlot = Alexa.getSlotValue(handlerInput.requestEnvelope, SLOTS.DATE);

    let mediaItem;
    if (movieSlot) {
      console.log(movieSlot);
      console.log(dateSlot);
      console.log(token);

      try {

        const searchResponse = await authenticatedClient(token)(`https://api.trakt.tv/search/movie?query=${movieSlot}`).json<TraktMovieSearchResponse[]>();

        if (dateSlot) {
          console.log('we got a date in our utterance. lets match the closest movie');
          const isYear = new RegExp(/^\d{4}$/).test(dateSlot);

          let year;
          if (isYear) {
            year = dateSlot;
          } else {
            // First parse a useable date
            const date: { startDate: Date, endDate: Date } = new AmazonDateParser(dateSlot);
            year = date.startDate.getFullYear;
          }

          // Look for an exact date match
          mediaItem = searchResponse.filter(item => `${item.movie.year}` === year)?.[0]?.movie;
          // Lets find the closest match
          // if (!mediaItem) {
          // TODO lets do some number comparisons to find the closest year match
          // }

        }

        if (!mediaItem) {
          // Our date parsing either found nothing or wasn't included in the utterance. Picking the first item
          mediaItem = searchResponse[0]?.movie;
        }

        console.log(`Adding ${JSON.stringify(mediaItem, null, 2)} to watchlist`);

        await authenticatedClient(token)('https://api.trakt.tv/sync/watchlist', {
          body: JSON.stringify({
            movies: [mediaItem]
          }),
          method: 'POST'
        }).json<TraktMovieSearchResponse[]>();

        // TODO a) global error loggging and b) link account card here
      } catch (e) {
        console.error(e);
      }
    }

    // TODO handle some sort of slot-less error state
    const speakOutput = handlerInput.t(STRINGS.ADD_SUCCESS).replace('MOVIE', mediaItem.title).replace('YEAR', mediaItem.year);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};
