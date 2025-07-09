import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { QuestSuggestionEntity } from '../quest-suggestion';
import { UserEntity } from '../user';

@Entity('quest_suggestion_vote')
export class QuestSuggestionVoteEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'boolean' })
  public vote: boolean;

  @Column({ type: 'integer', name: 'quest_suggestion_id' })
  public questSuggestionId: number;

  @ManyToOne(
    () => QuestSuggestionEntity,
    (questSuggestion) => questSuggestion.questSuggestionVoteList,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: false
    }
  )
  @JoinColumn([{ name: 'quest_suggestion_id', referencedColumnName: 'id' }])
  public questSuggestion: QuestSuggestionEntity;

  @Column({ type: 'integer', name: 'user_id' })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.personalQuestList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  public user: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
