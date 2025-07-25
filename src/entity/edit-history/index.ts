import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { HistoryType } from '../../domain/enum';

@Entity('edit_history')
export class EditHistoryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'user_id', type: 'integer' })
  public userId: number;

  @Column({ name: 'entity_type', type: 'varchar', length: 100 })
  public entityType: string;

  @Column({ type: 'enum', enum: HistoryType })
  public type: HistoryType;

  @Column({ name: 'entity_id', type: 'integer' })
  public entityId: number;

  @Column({ name: 'old_data', type: 'json', nullable: true })
  public oldData: unknown | null;

  @Column({ name: 'new_data', type: 'json' })
  public newData: unknown;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
