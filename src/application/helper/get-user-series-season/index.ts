import { WatchStatus } from '@domain/enum';
import { insertId } from '@main/utils';
import { userSeriesRepository } from '@repository/user-series';
import { finishedAt } from '../finished-at';
import { getWatchStatusOrder } from '../get-watch-status-order';

interface getUserSeriesProps {
  userId: number;
  seriesId: number;
}
export const getUserSeries = async ({
  seriesId,
  userId
}: getUserSeriesProps): Promise<{ id: number; watchStatus: WatchStatus } | null> => {
  try {
    const userSeries = await userSeriesRepository.findOne({
      select: { id: true, watchStatus: true },
      where: { finishedAt, userId, seriesId }
    });

    if (userSeries) return { id: userSeries?.id, watchStatus: userSeries?.watchStatus };

    return {
      id: insertId(
        await userSeriesRepository.insert({
          watchStatus: WatchStatus.WATCHING,
          watchStatusOrder: getWatchStatusOrder(WatchStatus.WATCHING),
          userId,
          seriesId
        })
      ),
      watchStatus: WatchStatus.WATCHING
    };
  } catch {
    return null;
  }
};
