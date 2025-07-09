import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserEntity } from '../user';
import { UserQuestEntity } from '../user-quest';

@Entity('quest')
export class QuestEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'boolean', default: false, name: 'count_to_day' })
  public countToDay: boolean;

  @Column({ type: 'integer', nullable: true })
  public order: number | null;

  @Column({ type: 'integer', name: 'created_by_id' })
  public createdById: number;

  @ManyToOne(() => UserEntity, (user) => user.questList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'created_by_id', referencedColumnName: 'id' }])
  public createdBy: UserEntity;

  @Column({ type: 'integer', name: 'deleted_by_id', nullable: true })
  public deletedById: number | null;

  @ManyToOne(() => UserEntity, (user) => user.questDeletedList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true
  })
  @JoinColumn([{ name: 'deleted_by_id', referencedColumnName: 'id' }])
  public deletedBy: UserEntity | null;

  @OneToMany(() => UserQuestEntity, (userQuest) => userQuest.quest)
  public userQuestList: UserQuestEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
