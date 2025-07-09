import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { PlaylistEntity } from '../playlist';
import { UserEntity } from '../user';

@Index('user_playlist_unique_index', ['user', 'playlist'], { unique: true })
@Entity('user_playlist')
export class UserPlaylistEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'boolean', name: 'is_collaborator', default: false })
  public isCollaborator: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_owner' })
  public isOwner: boolean;

  @Column({ type: 'integer', name: 'playlist_id' })
  public playlistId: number;

  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.userPlaylistList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'playlist_id', referencedColumnName: 'id' }])
  public playlist: PlaylistEntity;

  @Column({ type: 'integer', name: 'user_id' })
  public userId: number;

  @ManyToOne(() => UserEntity, (user) => user.userPlaylistList, {
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
