import * as Alexa from 'ask-sdk';
import i18next, { StringMap, TOptions } from 'i18next';

import languageStrings from '../strings';
import { HandlerInput } from '../types/alexa';

// This request interceptor will bind a translation function 't' to the handlerInput
export default {
  async process(handlerInput: HandlerInput): Promise<void> {

    const t = await i18next.init({
      lng: Alexa.getLocale(handlerInput.requestEnvelope),
      resources: languageStrings
    });

    handlerInput.t = (key: string | string[], options?: string | TOptions<StringMap>) => { return t(key, options); };
  }
};