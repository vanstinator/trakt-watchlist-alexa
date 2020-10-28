export default {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput = handlerInput.t('ERROR_MSG');
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};