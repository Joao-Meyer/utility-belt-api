import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { WatchStatus } from '../../domain/enum';
import { SeriesSeasonEntity } from '../series-season';
import { UserEntity } from '../user';
import { UserSeriesEntity } from '../user-series';
import { UserSeriesEpisodeWatchedEntity } from '../user-series-episode-watched';

// @Index(['userSeriesId'])
// @Index(['seriesSeasonId'])
// @Index(['status'])
@Index(
  'season_progress_series_season_user_series_unique_index',
  ['seriesSeasonId', 'userSeriesId'],
  { unique: true }
)
@Index('season_progress_series_season_user_id_unique_index', ['userId', 'seriesSeasonId'], {
  unique: true
})
@Entity('user_series_season_progress')
export class UserSeriesSeasonProgressEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({
    type: 'enum',
    name: 'watch_status',
    enum: WatchStatus,
    default: WatchStatus.NONE
  })
  public watchStatus: WatchStatus;

  @Column({ type: 'integer', name: 'series_season_id' })
  public seriesSeasonId: number;

  @ManyToOne(
    () => SeriesSeasonEntity,
    (seriesSeason) => seriesSeason.userSeriesSeasonProgressList,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: false
    }
  )
  @JoinColumn([{ name: 'series_season_id', referencedColumnName: 'id' }])
  public seriesSeason: SeriesSeasonEntity;

  @Column({ type: 'integer', name: 'user_series_id' })
  public userSeriesId: number;

  @ManyToOne(() => UserSeriesEntity, (userSeries) => userSeries.userSeriesSeasonProgressList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'user_series_id', referencedColumnName: 'id' }])
  public userSeries: UserSeriesEntity;

  @OneToMany(
    () => UserSeriesEpisodeWatchedEntity,
    (userSeriesEpisodeWatched) => userSeriesEpisodeWatched.userSeriesSeasonProgress
  )
  public userSeriesEpisodeWatchedList: UserSeriesEpisodeWatchedEntity[];

  @Column({ type: 'integer', name: 'user_id' })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.userSeriesSeasonProgressList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public user: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
