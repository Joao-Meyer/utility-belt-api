import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ThemeType } from '../../domain/enum';
import { MovieEntity } from '../movie';
import { PlaylistEntity } from '../playlist';
import { SeriesEntity } from '../series';
import { SeriesSeasonEntity } from '../series-season';

// @Index(['seriesId'])
// @Index(['movieId'])
// @Index(['playlistId'])
// @Index(['seriesSeasonId'])
@Entity('theme')
export class ThemeEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  public title: string;

  @Column({ type: 'enum', enum: ThemeType })
  public type: ThemeType;

  @Column({ type: 'text', nullable: true })
  public url: string | null;

  @Column({ type: 'text', name: 'youtube_id', nullable: true })
  public youtubeId: string | null;

  @Column({ type: 'text', name: 'youtube_music_url', nullable: true })
  public youtubeMusicUrl: string | null;

  @Column({ type: 'text', name: 'spotify_url', nullable: true })
  public spotifyUrl: string | null;

  @Column({ type: 'int', default: 1 })
  public order: number;

  @Column({ type: 'integer', name: 'series_id', nullable: true })
  public seriesId: number | null;

  @ManyToOne(() => SeriesEntity, (series) => series.themeList, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'series_id' })
  public series: SeriesEntity | null;

  @Column({ type: 'integer', name: 'movie_id', nullable: true })
  public movieId: number | null;

  @ManyToOne(() => MovieEntity, (movie) => movie.themeList, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'movie_id' })
  public movie: MovieEntity | null;

  @Column({ type: 'integer', name: 'playlist_id', nullable: true })
  public playlistId: number | null;

  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.themeList, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'playlist_id' })
  public playlist: PlaylistEntity | null;

  @Column({ type: 'integer', name: 'series_season_id', nullable: true })
  public seriesSeasonId: number | null;

  @ManyToOne(() => SeriesSeasonEntity, (season) => season.themeList, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'series_season_id' })
  public seriesSeason: SeriesSeasonEntity | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
