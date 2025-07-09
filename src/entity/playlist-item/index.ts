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
import { MovieEntity } from '../movie';
import { PlaylistEntity } from '../playlist';
import { SeriesEntity } from '../series';

// @Index(['playlistId'])
// @Index(['seriesId'])
// @Index(['movieId'])
@Index('playlist_item_movie_playlist_unique_key', ['movie', 'playlist'], { unique: true })
@Index('playlist_item_series_playlist_unique_key', ['series', 'playlist'], { unique: true })
@Entity('playlist_item')
export class PlaylistItemEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'integer', default: -1 })
  public order: number;

  @Column({ type: 'integer', name: 'series_id', nullable: true })
  public seriesId: number | null;

  @ManyToOne(() => SeriesEntity, (series) => series.playlistItemList, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'series_id' })
  public series: SeriesEntity | null;

  @Column({ type: 'integer', name: 'movie_id', nullable: true })
  public movieId: number | null;

  @ManyToOne(() => MovieEntity, (movie) => movie.playlistItemList, {
    nullable: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'movie_id' })
  public movie: MovieEntity | null;

  @Column({ type: 'integer', name: 'playlist_id' })
  public playlistId: number;

  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.playlistItemList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'playlist_id', referencedColumnName: 'id' }])
  public playlist: PlaylistEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
