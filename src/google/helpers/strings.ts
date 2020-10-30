import i18next, { TFunction } from 'i18next';

import languageStrings from '../../core/strings';

export default async (locale: string): Promise<TFunction> => {
  const t = await i18next.init({
    lng: locale,
    resources: languageStrings
  });

  return t;
};