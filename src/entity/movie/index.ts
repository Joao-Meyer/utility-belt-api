import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { MovieCategoryEntity } from '../movie-category';
import { MovieTagEntity } from '../movie-tag';
import { PlaylistItemEntity } from '../playlist-item';
import { ThemeEntity } from '../theme';
import { UserMovieEntity } from '../user-movie';

@Entity('movie')
export class MovieEntity {
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

  @Column({ type: 'float' })
  public duration: number;

  @Column({ type: 'text', nullable: true })
  public homepage: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public imdbId: string | null;

  @Column({ type: 'text', name: 'backdrop_image_url' })
  public backdropImageUrl: string;

  @Column({ type: 'text', nullable: true })
  public trailerUrl: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public trailerYoutubeId: string | null;

  @Column({ type: 'text', default: '' })
  public synopsis: string;

  @Column({ type: 'int', default: 0 })
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

  @Column({ type: 'text', array: true, name: 'alternative_title_list' })
  public alternativeTitleList: string[];

  @OneToMany(() => MovieCategoryEntity, (movieCategory) => movieCategory.movie)
  public movieCategoryList: MovieCategoryEntity[];

  @OneToMany(() => MovieTagEntity, (movieTag) => movieTag.movie)
  public movieTagList: MovieTagEntity[];

  @OneToMany(() => ThemeEntity, (theme) => theme.movie)
  public themeList: ThemeEntity[];

  @OneToMany(() => UserMovieEntity, (movie) => movie.movie)
  public userMovieList: UserMovieEntity[];

  @OneToMany(() => PlaylistItemEntity, (playlistItem) => playlistItem.movie)
  public playlistItemList: PlaylistItemEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
