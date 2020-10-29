import * as Alexa from 'ask-sdk';
import i18next from 'i18next';

import languageStrings from '../strings';

export default async function t(key: string, handlerInput): Promise<string> {
  const t = await i18next.init({
    lng: Alexa.getLocale(handlerInput.requestEnvelope),
    resources: languageStrings
  });

  return t(key);
}
