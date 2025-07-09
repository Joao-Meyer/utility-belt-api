import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { SeriesEntity } from '../series';
import { TagEntity } from '../tag';

@Entity('series_tag')
export class SeriesTagEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'integer', name: 'tag_id' })
  public tagId: number;

  @ManyToOne(() => TagEntity, (tag) => tag.seriesTagList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'tag_id', referencedColumnName: 'id' }])
  public tag: TagEntity;

  @Column({ type: 'integer', name: 'series_id' })
  public seriesId: number;

  @ManyToOne(() => SeriesEntity, (series) => series.seriesTagList, {
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
