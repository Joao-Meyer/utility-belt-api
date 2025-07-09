import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { PersonalQuestEntity } from '../personal-quest';
import { PlaylistEntity } from '../playlist';
import { QuestEntity } from '../quest';
import { QuestSuggestionEntity } from '../quest-suggestion';
import { UserDayEntity } from '../user-day';
import { UserMovieEntity } from '../user-movie';
import { UserPersonalQuestEntity } from '../user-personal-quest';
import { UserPlaylistEntity } from '../user-playlist';
import { UserQuestEntity } from '../user-quest';
import { UserSeriesEntity } from '../user-series';

@Index('user_username_key', ['username'], { unique: true })
@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ length: 255, type: 'varchar' })
  public username: string;

  @Column({ type: 'text' })
  public password: string;

  @Column({ length: 255, type: 'varchar' })
  public name: string;

  @Column({ type: 'text', nullable: true, name: 'avatar_url' })
  public avatarUrl: string | null;

  @OneToMany(() => QuestEntity, (personalQuest) => personalQuest.deletedBy)
  public questDeletedList: QuestEntity[];

  @OneToMany(() => QuestSuggestionEntity, (questSuggestion) => questSuggestion.createdBy)
  public questSuggestionList: QuestSuggestionEntity[];

  @OneToMany(() => QuestEntity, (personalQuest) => personalQuest.createdBy)
  public questList: QuestEntity[];

  @OneToMany(() => UserDayEntity, (userDay) => userDay.user)
  public userDayList: UserDayEntity[];

  @OneToMany(() => PersonalQuestEntity, (personalQuest) => personalQuest.user)
  public personalQuestList: PersonalQuestEntity[];

  @OneToMany(() => UserQuestEntity, (userQuest) => userQuest.user)
  public userQuestList: UserQuestEntity[];

  @OneToMany(() => UserPersonalQuestEntity, (userPersonalQuest) => userPersonalQuest.user)
  public userPersonalQuestList: UserPersonalQuestEntity[];

  @OneToMany(() => UserSeriesEntity, (series) => series.user)
  public userSeriesList: UserSeriesEntity[];

  @OneToMany(() => UserMovieEntity, (movie) => movie.user)
  public userMovieList: UserMovieEntity[];

  @OneToMany(() => UserPlaylistEntity, (playlist) => playlist.user)
  public userPlaylistList: UserPlaylistEntity[];

  @OneToMany(() => PlaylistEntity, (playlist) => playlist.owner)
  public myPlaylistList: PlaylistEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
