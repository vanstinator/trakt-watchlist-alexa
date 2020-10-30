import { Card, ConversationV3, Image } from '@assistant/conversation';

import addToWatchlist from '../../core/handlers/addToWatchlist';
import match from '../../core/handlers/match';
import logger from '../../core/utils/logger';
import { STRINGS } from '../../strings';

const log = logger.category('GOOGLE_ADD_ITEM_HANDLER');

export default async (conv: ConversationV3): Promise<ConversationV3> => {

  const token = conv.user.params.bearerToken;
  const movieParam = conv.intent.params['item'].original;

  log.debug(`Movie Param: ${movieParam}`);

  const itemMatch = await match(token, movieParam);
  await addToWatchlist(token, itemMatch.item);

  return conv.add(
    new Card({
      title: itemMatch.item?.title,
      subtitle: `${itemMatch.item?.year}`,
      image: new Image({
        // url: `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${itemMatch.item?.ids.tmdb}`,
        alt: itemMatch.item?.title
      })
    })
  );
};
