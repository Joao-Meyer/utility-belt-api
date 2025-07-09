import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { SeasonStatus } from '../../domain/enum';
import { SeriesEntity } from '../series';
import { SeriesSeasonEpisodeEntity } from '../series-season-episode';
import { ThemeEntity } from '../theme';
import { UserSeriesSeasonProgressEntity } from '../user-series-season-progress';

@Entity('series_season')
export class SeriesSeasonEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'int', unique: true, name: 'tmdb_id', nullable: true })
  public tmdbId: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @Column({ type: 'text', default: '' })
  public synopsis: string;

  @Column({ type: 'text', name: 'image_url' })
  public imageUrl: string;

  @Column({ type: 'int', default: 12, name: 'total_episodes' })
  public totalEpisodes: number;

  @Column({ type: 'enum', enum: SeasonStatus, default: SeasonStatus.COMPLETED })
  public status: SeasonStatus;

  @Column({ type: 'int', name: 'season_number' })
  public seasonNumber: number;

  @Column({ name: 'aired_at', type: 'timestamptz', nullable: true })
  public airedAt: Date | null;

  @Column({ name: 'aired_end_at', type: 'timestamptz', nullable: true })
  public airedEndAt: Date | null;

  @Column({ type: 'integer', name: 'series_id' })
  public seriesId: number;

  @ManyToOne(() => SeriesEntity, (series) => series.seriesSeasonList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'series_id', referencedColumnName: 'id' }])
  public series: SeriesEntity;

  @OneToMany(
    () => SeriesSeasonEpisodeEntity,
    (seriesSeasonEpisode) => seriesSeasonEpisode.seriesSeason
  )
  public seriesSeasonEpisodeList: SeriesSeasonEpisodeEntity[];

  @OneToMany(
    () => UserSeriesSeasonProgressEntity,
    (userSeriesSeasonProgress) => userSeriesSeasonProgress.seriesSeason
  )
  public userSeriesSeasonProgressList: UserSeriesSeasonProgressEntity[];

  @OneToMany(() => ThemeEntity, (theme) => theme.seriesSeason)
  public themeList: ThemeEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
