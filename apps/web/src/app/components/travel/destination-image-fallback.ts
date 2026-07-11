import type { SyntheticEvent } from 'react';

export const DESTINATION_PLACEHOLDER = '/travel-images/placeholder.svg';

export function onDestinationImageError(event: SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (!img.src.endsWith(DESTINATION_PLACEHOLDER)) {
    img.src = DESTINATION_PLACEHOLDER;
  }
}
