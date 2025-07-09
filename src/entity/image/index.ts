import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserPersonalQuestEntity } from '../user-personal-quest';
import { UserQuestEntity } from '../user-quest';

@Entity('image')
export class ImageEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'text' })
  public url: string;

  @Column({ type: 'integer', name: 'user_personal_quest_id', nullable: true })
  public userPersonalQuestId: number | null;

  @Column({ type: 'integer', name: 'user_quest_id', nullable: true })
  public userQuestId: number | null;

  @ManyToOne(() => UserPersonalQuestEntity, (userPersonalQuest) => userPersonalQuest.imageList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true
  })
  @JoinColumn([{ name: 'user_personal_quest_id', referencedColumnName: 'id' }])
  public userPersonalQuest: UserPersonalQuestEntity | null;

  @ManyToOne(() => UserQuestEntity, (userQuest) => userQuest.imageList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true
  })
  @JoinColumn([{ name: 'user_quest_id', referencedColumnName: 'id' }])
  public userQuest: UserQuestEntity | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
