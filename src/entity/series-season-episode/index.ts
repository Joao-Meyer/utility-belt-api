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
import { SeriesSeasonEntity } from '../series-season';
import { UserSeriesEpisodeWatchedEntity } from '../user-series-episode-watched';

@Entity('series_season_episode')
export class SeriesSeasonEpisodeEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'int', unique: true, name: 'tmdb_id', nullable: true })
  public tmdbId: number;

  @Column({ type: 'varchar', length: 255 })
  public title: string;

  @Column({ type: 'text', default: '' })
  public synopsis: string;

  @Column({ type: 'text', name: 'image_url' })
  public imageUrl: string;

  @Column({ type: 'integer', name: 'episode_number' })
  public episodeNumber: number;

  @Column({ type: 'integer', name: 'season_number' })
  public seasonNumber: number;

  @Column({ type: 'float' })
  public duration: number;

  @Column({ name: 'aired_at', type: 'timestamptz', nullable: true })
  public airedAt: Date | null;

  @Column({ type: 'float', default: 0 })
  public score: number;

  @Column({ type: 'int', default: 0, name: 'scored_by' })
  public scoredBy: number;

  @Column({ type: 'integer', name: 'series_season_id' })
  public seriesSeasonId: number;

  @ManyToOne(() => SeriesSeasonEntity, (seriesSeason) => seriesSeason.seriesSeasonEpisodeList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'series_season_id', referencedColumnName: 'id' }])
  public seriesSeason: SeriesSeasonEntity;

  @OneToMany(
    () => UserSeriesEpisodeWatchedEntity,
    (userSeriesEpisodeWatched) => userSeriesEpisodeWatched.seriesSeasonEpisode
  )
  public userSeriesEpisodeWatchedList: UserSeriesEpisodeWatchedEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
