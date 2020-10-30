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
  const movieParam = conv.intent.params['item'].original;

  log.debug(`Movie Param: ${movieParam}`);

  const mediaItem = await (await match(token, movieParam)).item;

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
