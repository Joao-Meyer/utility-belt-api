import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ReleaseStatus } from '../../domain/enum';
import { PlaylistItemEntity } from '../playlist-item';
import { SeriesCategoryEntity } from '../series-category';
import { SeriesSeasonEntity } from '../series-season';
import { SeriesTagEntity } from '../series-tag';
import { ThemeEntity } from '../theme';
import { UserSeriesEntity } from '../user-series';

@Entity('series')
export class SeriesEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'int', unique: true, name: 'tmdb_id', nullable: true })
  public tmdbId: number;

  @Column({ type: 'varchar', length: 255 })
  public title: string;

  @Column({ type: 'varchar', length: 255, name: 'original_title' })
  public originalTitle: string;

  @Column({ type: 'text', name: 'image_url' })
  public imageUrl: string;

  @Column({ type: 'text', nullable: true })
  public homepage: string | null;

  @Column({
    type: 'enum',
    enum: ReleaseStatus,
    name: 'release_status',
    default: ReleaseStatus.FINISHED
  })
  public releaseStatus: ReleaseStatus;

  @Column({ type: 'text', name: 'backdrop_image_url' })
  public backdropImageUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public imdbId: string | null;

  @Column({ type: 'text', nullable: true })
  public trailerUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public trailerYoutubeId: string | null;

  @Column({ type: 'text', default: '' })
  public synopsis: string;

  @Column({ type: 'int', name: 'total_episodes' })
  public totalEpisodes: number;

  @Column({ type: 'int', name: 'total_seasons' })
  public totalSeasons: number;

  @Column({ type: 'int', default: -1 })
  public rank: number;

  @Column({ type: 'float', default: 0 })
  public score: number;

  @Column({ type: 'int', default: 0, name: 'scored_by' })
  public scoredBy: number;

  @Column({ type: 'int', default: 0, name: 'total_favorites' })
  public totalFavorites: number;

  @Column({ type: 'int', default: 0, name: 'total_watch_list' })
  public totalWatch: number;

  @Column({ name: 'aired_at', type: 'timestamptz', nullable: true })
  public airedAt: Date | null;

  @Column({ name: 'aired_end_at', type: 'timestamptz', nullable: true })
  public airedEndAt: Date | null;

  @Column({ type: 'text', array: true, name: 'alternative_title_list' })
  public alternativeTitleList: string[];

  @OneToMany(() => SeriesCategoryEntity, (seriesCategory) => seriesCategory.series)
  public seriesCategoryList: SeriesCategoryEntity[];

  @OneToMany(() => SeriesTagEntity, (seriesTag) => seriesTag.series)
  public seriesTagList: SeriesTagEntity[];

  @OneToMany(() => UserSeriesEntity, (series) => series.series)
  public userSeriesList: UserSeriesEntity[];

  @OneToMany(() => ThemeEntity, (theme) => theme.series)
  public themeList: ThemeEntity[];

  @OneToMany(() => SeriesSeasonEntity, (seriesSeason) => seriesSeason.series)
  public seriesSeasonList: SeriesSeasonEntity[];

  @OneToMany(() => PlaylistItemEntity, (playlistItem) => playlistItem.series)
  public playlistItemList: PlaylistItemEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
