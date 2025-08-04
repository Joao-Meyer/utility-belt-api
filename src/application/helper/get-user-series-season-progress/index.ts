import { WatchStatus } from '@domain/enum';
import { insertId } from '@main/utils';
import { userSeriesSeasonProgressRepository } from '@repository/user-series-season-progress';
import { finishedAt } from '../finished-at';

interface getUserSeriesSeasonProgressProps {
  userSeriesId: number;
  seriesSeasonId: number;
  userId: number;
}

export const getUserSeriesSeasonProgress = async ({
  seriesSeasonId,
  userSeriesId,
  userId
}: getUserSeriesSeasonProgressProps): Promise<{ id: number; watchStatus: WatchStatus } | null> => {
  try {
    const userSeriesSeasonProgress = await userSeriesSeasonProgressRepository.findOne({
      select: { id: true, watchStatus: true },
      where: { finishedAt, seriesSeasonId, userSeriesId }
    });

    if (userSeriesSeasonProgress)
      return {
        id: userSeriesSeasonProgress?.id,
        watchStatus: userSeriesSeasonProgress?.watchStatus
      };

    return {
      id: insertId(
        await userSeriesSeasonProgressRepository.insert({
          watchStatus: WatchStatus.NONE,
          userId,
          seriesSeasonId,
          userSeriesId
        })
      ),
      watchStatus: WatchStatus.NONE
    };
  } catch {
    return null;
  }
};
