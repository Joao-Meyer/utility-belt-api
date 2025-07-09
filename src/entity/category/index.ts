import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { MovieCategoryEntity } from '../movie-category';
import { SeriesCategoryEntity } from '../series-category';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public name: string;

  @OneToMany(() => SeriesCategoryEntity, (seriesCategory) => seriesCategory.category)
  public seriesCategoryList: SeriesCategoryEntity[];

  @OneToMany(() => MovieCategoryEntity, (movieCategory) => movieCategory.category)
  public movieCategoryList: MovieCategoryEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
