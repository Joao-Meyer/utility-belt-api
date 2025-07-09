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
import { ImageEntity } from '../image';
import { PersonalQuestEntity } from '../personal-quest';
import { UserEntity } from '../user';

@Entity('user_personal_quest')
export class UserPersonalQuestEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @CreateDateColumn({ type: 'date' })
  public day: Date;

  @Column({ type: 'integer', name: 'user_id' })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.userPersonalQuestList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public user: UserEntity;

  @Column({ type: 'integer', name: 'personal_quest_id' })
  public personalQuestId: number;

  @ManyToOne(() => PersonalQuestEntity, (personalQuest) => personalQuest.userPersonalQuestList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'personal_quest_id', referencedColumnName: 'id' }])
  public personalQuest: PersonalQuestEntity;

  @OneToMany(() => ImageEntity, (image) => image.userPersonalQuest, { eager: true })
  public imageList: ImageEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
