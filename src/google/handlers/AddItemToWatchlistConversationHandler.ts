import { Card, ConversationV3, Image } from '@assistant/conversation';

import addToWatchlist from '../../core/handlers/addToWatchlist';
import match from '../../core/handlers/match';
import getImageUrl from '../../core/helpers/getImageUrl';
import { STRINGS } from '../../core/strings';
import logger from '../../core/utils/logger';
import strings from '../helpers/strings';

const log = logger.category('GOOGLE_ADD_ITEM_HANDLER');

export default async (conv: ConversationV3): Promise<ConversationV3> => {

  const t = await strings(conv.user.locale);
  const token = conv.user.params.bearerToken;
  const movieParam = conv.intent.params['item']?.original;
  const timeSeriesParam = conv.intent.params['timeSeries']?.original;
  const year = conv.intent.params['number']?.original;

  log.debug(`Item Title: ${movieParam}`);
  log.debug(`Time Series: ${timeSeriesParam}`);
  log.debug(`Year: ${year}`);

  const mediaItem = (await match(token, movieParam, year, timeSeriesParam)).item;

  if (mediaItem) {
    await addToWatchlist(token, mediaItem);

    const imageUrl = await getImageUrl(mediaItem.ids.tmdb);

    conv.add(t(STRINGS.ADD_SUCCESS).replace('MOVIE', mediaItem.title).replace('YEAR', mediaItem.year.toString()));
    return conv.add(
      new Card({
        title: mediaItem.title,
        subtitle: `${mediaItem.year}`,
        image: new Image({
          url: `${imageUrl}`,
          alt: mediaItem.title
        })
      })
    );
  }
};
