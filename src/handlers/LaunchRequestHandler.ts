import * as Alexa from 'ask-sdk';

import { STRINGS } from '../strings';

export default {
  // TODO find the correct type
  canHandle(handlerInput): boolean {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = handlerInput.t(STRINGS.WELCOME);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};
