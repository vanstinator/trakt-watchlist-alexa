import { authenticatedClient } from '../services/got';
import { TraktItem } from '../types/trakt';
import logger from '../utils/logger';

const log = logger.category('ADD_ITEM');

export default async (token: string, item: TraktItem): Promise<void> => {
  try {
    await authenticatedClient(token)('https://api.trakt.tv/sync/watchlist', {
      body: JSON.stringify({
        movies: [item]
      }),
      method: 'POST'
    });

  } catch (e) {
    log.error(e);
  }
};