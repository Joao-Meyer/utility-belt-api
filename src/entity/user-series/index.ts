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
import { SeriesEntity } from '../series';
import { UserEntity } from '../user';
import { UserSeriesSeasonProgressEntity } from '../user-series-season-progress';

// @Index(['userId'])
// @Index(['seriesId'])
// @Index(['status'])
@Index('user_user_series_unique_index', ['userId', 'seriesId'], { unique: true })
@Entity('user_series')
export class UserSeriesEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'boolean', default: false })
  public favorite: boolean;

  @Column({
    type: 'enum',
    name: 'watch_status',
    enum: WatchStatus,
    default: WatchStatus.NONE
  })
  public watchStatus: WatchStatus;

  @Column({ type: 'int', name: 'watch_status_order', default: 0 })
  public watchStatusOrder: number;

  @Column({ type: 'int', name: 'total_season_watched', default: 0 })
  public totalSeasonWatched: number;

  @Column({ type: 'float', nullable: true, default: null })
  public score: number | null;

  @Column({ type: 'integer', name: 'series_id' })
  public seriesId: number;

  @ManyToOne(() => SeriesEntity, (series) => series.userSeriesList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'series_id', referencedColumnName: 'id' }])
  public series: SeriesEntity;

  @Column({ type: 'integer', name: 'user_id' })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.userSeriesList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public user: UserEntity;

  @OneToMany(
    () => UserSeriesSeasonProgressEntity,
    (userSeriesSeasonProgress) => userSeriesSeasonProgress.userSeries
  )
  public userSeriesSeasonProgressList: UserSeriesSeasonProgressEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
