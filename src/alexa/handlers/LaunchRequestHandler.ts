import * as Alexa from 'ask-sdk';
import { Response } from 'ask-sdk-model';

import { STRINGS } from '../../core/strings';
import { HandlerInput } from '../../core/types/alexa';

export default {

  canHandle(handlerInput: HandlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },

  handle(handlerInput: HandlerInput): Response {
    const speakOutput = handlerInput.t(STRINGS.WELCOME);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};
