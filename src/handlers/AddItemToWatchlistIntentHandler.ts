import * as Alexa from 'ask-sdk';
import { Response } from 'ask-sdk-model';

import { SLOTS } from '../constants/slots';
import { STRINGS } from '../strings';
import { HandlerInput } from '../types/alexa';
import { TraktMovieSearchResponse } from '../types/trakt';

export default {
  canHandle(handlerInput: HandlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AddItemToWatchlistIntent';
  },
  async handle(handlerInput) {

  async handle(handlerInput: HandlerInput): Promise<Response> {

    const slot = Alexa.getSlotValue(handlerInput.requestEnvelope, SLOTS.MOVIE);

    if (slot) {
      const token = Alexa.getAccountLinkingAccessToken(handlerInput.requestEnvelope);
      console.log(slot);
      console.log(token);

      try {
        const searchResponse = await got(`https://api.trakt.tv/search/movie?query=${slot}`, {
          headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': process.env.TRAKT_CLIENT,
            Authorization: `Bearer ${token}`
          }
        }).json<TraktMovieSearchResponse[]>();

        movie = searchResponse[0].movie;

        console.log(`Adding ${JSON.stringify(movie, null, 2)} to watchlist`);

        await got('https://api.trakt.tv/sync/watchlist', {
          headers: {
            'Content-Type': 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': process.env.TRAKT_CLIENT,
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            movies: [movie]
          }),
          method: 'POST'
        }).json<TraktMovieSearchResponse[]>();

        // TODO a) global error loggging and b) link account card here
      } catch (e) {
        console.error(e);
      }
    }

    // TODO handle some sort of slot-less error state
    const speakOutput = handlerInput.t(STRINGS.ADD_SUCCESS).replace('MOVIE', movie.title).replace('YEAR', movie.year);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};
