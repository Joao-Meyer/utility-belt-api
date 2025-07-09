import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { MovieEntity } from '../movie';
import { TagEntity } from '../tag';

@Entity('movie_tag')
export class MovieTagEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'integer', name: 'tag_id' })
  public tagId: number;

  @ManyToOne(() => TagEntity, (tag) => tag.movieTagList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  public tag: TagEntity;

  @Column({ type: 'integer', name: 'movie_id' })
  public movieId: number;

  @ManyToOne(() => MovieEntity, (movie) => movie.movieTagList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'movie_id', referencedColumnName: 'id' }])
  public movie: MovieEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
