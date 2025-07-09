import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { CategoryEntity } from '../category';
import { MovieEntity } from '../movie';

@Entity('movie_category')
export class MovieCategoryEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'integer', name: 'category_id' })
  public categoryId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.movieCategoryList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  public category: CategoryEntity;

  @Column({ type: 'integer', name: 'movie_id' })
  public movieId: number;

  @ManyToOne(() => MovieEntity, (movie) => movie.movieCategoryList, {
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
