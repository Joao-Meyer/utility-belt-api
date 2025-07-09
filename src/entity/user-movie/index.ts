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
import { MovieEntity } from '../movie';
import { UserEntity } from '../user';

// @Index(['userId'])
// @Index(['movieId'])
// @Index(['watchStatus'])
@Index('user_user_movie_unique_index', ['userId', 'movieId'], { unique: true })
@Entity('user_movie')
export class UserMovieEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'boolean', default: false })
  public favorite: boolean;

  @Column({
    type: 'enum',
    name: 'watch_status',
    enum: WatchStatus,
    default: WatchStatus.NOT_STARTED
  })
  public watchStatus: WatchStatus;

  @Column({ type: 'int', name: 'watch_status_order', default: 0 })
  public watchStatusOrder: number;

  @Column({ type: 'float', nullable: true, default: null })
  public score: number | null;

  @Column({ type: 'integer', name: 'movie_id' })
  public movieId: number;

  @ManyToOne(() => MovieEntity, (movie) => movie.userMovieList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'movie_id', referencedColumnName: 'id' }])
  public movie: MovieEntity;

  @Column({ type: 'integer', name: 'user_id' })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.userMovieList, {
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
