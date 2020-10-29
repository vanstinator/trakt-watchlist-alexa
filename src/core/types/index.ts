import { TraktMovieSearchResponse } from '../../types/trakt';

import { TraktItem } from './trakt';

export enum MatchConfidence {
  HIGH,
  LOW
}

export interface Match {
  item?: TraktItem,
  confidence: MatchConfidence
}