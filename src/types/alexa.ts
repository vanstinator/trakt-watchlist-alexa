import * as Alexa from 'ask-sdk';
import { TFunction } from 'i18next';

export interface HandlerInput extends Alexa.HandlerInput {
  t: TFunction
}