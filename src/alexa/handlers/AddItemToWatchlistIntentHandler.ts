import * as Alexa from 'ask-sdk';
import { Response } from 'ask-sdk-model';

import addToWatchlist from '../../core/handlers/addToWatchlist';
import match from '../../core/handlers/match';
import { STRINGS } from '../../core/strings';
import { HandlerInput } from '../../core/types/alexa';
import logger from '../../core/utils/logger';
import { SLOTS } from '../constants/slots';

const log = logger.category('ALEXA_ADD_ITEM_HANDLER');

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

      await addToWatchlist(token, mediaItem);
    }

    // TODO handle some sort of slot-less error state
    const speakOutput = handlerInput.t(STRINGS.ADD_SUCCESS).replace('MOVIE', mediaItem.title).replace('YEAR', mediaItem.year);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  }
};
