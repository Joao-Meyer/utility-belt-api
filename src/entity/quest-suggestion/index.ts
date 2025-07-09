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
import { QuestSuggestionVoteEntity } from '../quest-suggestion-vote';
import { UserEntity } from '../user';

@Entity('quest_suggestion')
export class QuestSuggestionEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'integer', name: 'created_by_id' })
  public createdById: number;

  @ManyToOne(() => UserEntity, (user) => user.questSuggestionList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'created_by_id', referencedColumnName: 'id' }])
  public createdBy: UserEntity;

  @OneToMany(
    () => QuestSuggestionVoteEntity,
    (questSuggestionVote) => questSuggestionVote.questSuggestion
  )
  public questSuggestionVoteList: QuestSuggestionVoteEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
