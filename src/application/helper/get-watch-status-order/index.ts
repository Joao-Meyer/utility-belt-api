import { WatchStatus } from '@domain/enum';

export const getWatchStatusOrder = (status: WatchStatus): number => {
  switch (status) {
    case WatchStatus.NOT_STARTED:
      return 0;
    case WatchStatus.WATCHING:
      return 1;
    case WatchStatus.WATCH_LATER:
      return 2;
    case WatchStatus.DROPPED:
      return 3;
    case WatchStatus.WATCHED:
      return 4;

    default:
      return 5;
  }
};
