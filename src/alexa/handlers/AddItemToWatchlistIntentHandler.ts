import * as Alexa from 'ask-sdk';
import { Response } from 'ask-sdk-model';

import match from '../../core/handlers/match';
import { authenticatedClient } from '../../core/services/got';
import { HandlerInput } from '../../core/types/alexa';
import { TraktMovieSearchResponse } from '../../core/types/trakt';
import logger from '../../core/utils/logger';
import { STRINGS } from '../../strings';
import { SLOTS } from '../constants/slots';

const log = logger.category('ADD_ITEM_INTENT');

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
      log.debug(`itemSlot ${movieSlot}`);
      log.debug(`dateSlot ${dateSlot}`);
      log.debug(`timeSeriesSlot ${timeSeriesSlot}`);

      mediaItem = (await match(token, movieSlot, dateSlot, timeSeriesSlot)).item;

      log.trace(`Adding ${JSON.stringify(mediaItem, null, 2)} to watchlist`);

      try {
        await authenticatedClient(token)('https://api.trakt.tv/sync/watchlist', {
          body: JSON.stringify({
            movies: [mediaItem]
          }),
          method: 'POST'
        }).json<TraktMovieSearchResponse[]>();

      } catch (e) {
        log.error(e);
      }
    }

    // TODO handle some sort of slot-less error state
    const speakOutput = handlerInput.t(STRINGS.ADD_SUCCESS).replace('MOVIE', mediaItem.title).replace('YEAR', mediaItem.year);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};
