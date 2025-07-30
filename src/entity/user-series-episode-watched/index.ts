import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { WatchStatus } from '../../domain/enum';
import { SeriesSeasonEpisodeEntity } from '../series-season-episode';
import { UserSeriesSeasonProgressEntity } from '../user-series-season-progress';

// @Index(['userSeriesSeasonProgressId'])
// @Index(['seriesSeasonEpisodeId'])
@Index(
  'episode_watched_series_season_episode_season_progress_unique_index',
  ['userSeriesSeasonProgressId', 'seriesSeasonEpisodeId'],
  { unique: true }
)
@Entity('user_series_episode_watched')
export class UserSeriesEpisodeWatchedEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({
    type: 'enum',
    name: 'watch_status',
    enum: WatchStatus,
    default: WatchStatus.NONE
  })
  public watchStatus: WatchStatus;

  @Column({ type: 'float', nullable: true, default: null })
  public score: number | null;

  @Column({ type: 'integer', name: 'series_season_episode_id' })
  public seriesSeasonEpisodeId: number;

  @ManyToOne(
    () => SeriesSeasonEpisodeEntity,
    (seriesSeasonEpisode) => seriesSeasonEpisode.userSeriesEpisodeWatchedList,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: false
    }
  )
  @JoinColumn([{ name: 'series_season_episode_id', referencedColumnName: 'id' }])
  public seriesSeasonEpisode: SeriesSeasonEpisodeEntity;

  @Column({ type: 'integer', name: 'user_series_season_progress_id' })
  public userSeriesSeasonProgressId: number;

  @ManyToOne(
    () => UserSeriesSeasonProgressEntity,
    (userSeriesSeasonProgress) => userSeriesSeasonProgress.userSeriesEpisodeWatchedList,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: false
    }
  )
  @JoinColumn([{ name: 'user_series_season_progress_id', referencedColumnName: 'id' }])
  public userSeriesSeasonProgress: UserSeriesSeasonProgressEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
