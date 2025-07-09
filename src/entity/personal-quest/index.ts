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
import { UserPersonalQuestEntity } from '../user-personal-quest';

@Entity('personal_quest')
export class PersonalQuestEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'integer', name: 'user_id' })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.personalQuestList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public user: UserEntity;

  @OneToMany(() => UserPersonalQuestEntity, (userPersonalQuest) => userPersonalQuest.personalQuest)
  public userPersonalQuestList: UserPersonalQuestEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
