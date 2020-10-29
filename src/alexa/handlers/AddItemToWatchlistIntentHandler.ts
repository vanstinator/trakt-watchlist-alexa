import * as Alexa from 'ask-sdk';
import { Response } from 'ask-sdk-model';

import match from '../../core/handlers/match';
import { authenticatedClient } from '../../core/services/got';
import { HandlerInput } from '../../core/types/alexa';
import { TraktMovieSearchResponse } from '../../core/types/trakt';
import { STRINGS } from '../../strings';
import { SLOTS } from '../constants/slots';

export default {

  canHandle(handlerInput: HandlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AddItemToWatchlistIntent';
  },

  async handle(handlerInput: HandlerInput): Promise<Response> {

    const token = Alexa.getAccountLinkingAccessToken(handlerInput.requestEnvelope);

    const dateSlot = Alexa.getSlotValue(handlerInput.requestEnvelope, SLOTS.DATE);
    const movieSlot = Alexa.getSlotValue(handlerInput.requestEnvelope, SLOTS.MOVIE);
    const timeSeriesSlot = Alexa.getSlot(handlerInput.requestEnvelope, SLOTS.TIME_SERIES).resolutions?.resolutionsPerAuthority?.[0].values[0].value.name;

    let mediaItem;
    if (movieSlot) {
      console.log(movieSlot);
      console.log(dateSlot);
      console.log(timeSeriesSlot);
      console.log(token);

      mediaItem = (await match(token, movieSlot, dateSlot, timeSeriesSlot)).item;

      console.log(`Adding ${JSON.stringify(mediaItem, null, 2)} to watchlist`);

      try {
        await authenticatedClient(token)('https://api.trakt.tv/sync/watchlist', {
          body: JSON.stringify({
            movies: [mediaItem]
          }),
          method: 'POST'
        }).json<TraktMovieSearchResponse[]>();

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
