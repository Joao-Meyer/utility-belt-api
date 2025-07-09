import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ImageEntity } from '../image';
import { QuestEntity } from '../quest';
import { UserEntity } from '../user';

@Index('user_quest_day_user_quest_key', ['day', 'quest', 'user'], { unique: true })
@Entity('user_quest')
export class UserQuestEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @CreateDateColumn({ type: 'date' })
  public day: Date;

  @Column({ type: 'integer', name: 'user_id' })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.personalQuestList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public user: UserEntity;

  @Column({ type: 'integer', name: 'quest_id' })
  public questId: number;

  @ManyToOne(() => QuestEntity, (quest) => quest.userQuestList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'quest_id', referencedColumnName: 'id' }])
  public quest: QuestEntity;

  @OneToMany(() => ImageEntity, (image) => image.userPersonalQuest, { eager: true })
  public imageList: ImageEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
