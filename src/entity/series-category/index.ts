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
import { SeriesEntity } from '../series';

@Entity('series_category')
export class SeriesCategoryEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'integer', name: 'category_id' })
  public categoryId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.seriesCategoryList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  public category: CategoryEntity;

  @Column({ type: 'integer', name: 'series_id' })
  public seriesId: number;

  @ManyToOne(() => SeriesEntity, (series) => series.seriesCategoryList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'series_id', referencedColumnName: 'id' }])
  public series: SeriesEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
