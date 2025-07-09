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
import { PlaylistVisibility } from '../../domain/enum';
import { PlaylistItemEntity } from '../playlist-item';
import { ThemeEntity } from '../theme';
import { UserEntity } from '../user';
import { UserPlaylistEntity } from '../user-playlist';

@Entity('playlist')
export class PlaylistEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  public id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  public name: string;

  @Column({ type: 'integer', default: -1 })
  public order: number;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  public imageUrl: string | null;

  @Column({ type: 'enum', enum: PlaylistVisibility })
  public visibility: PlaylistVisibility;

  @OneToMany(() => PlaylistItemEntity, (playlistItem) => playlistItem.playlist)
  public playlistItemList: PlaylistItemEntity[];

  @OneToMany(() => UserPlaylistEntity, (userPlaylist) => userPlaylist.playlist)
  public userPlaylistList: UserPlaylistEntity[];

  @OneToMany(() => ThemeEntity, (theme) => theme.playlist)
  public themeList: ThemeEntity[];

  @Column({ type: 'integer', name: 'owner_id' })
  public ownerId: number;

  @ManyToOne(() => UserEntity, (owner) => owner.myPlaylistList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false
  })
  @JoinColumn([{ name: 'owner_id', referencedColumnName: 'id' }])
  public owner: UserEntity;

  @Column({ type: 'integer', name: 'parent_id', nullable: true })
  public parentId: number | null;

  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.subPlaylistList, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'parent_id' })
  public parent: PlaylistEntity | null;

  @OneToMany(() => PlaylistEntity, (playlist) => playlist.parent)
  public subPlaylistList: PlaylistEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  public updatedAt: Date | null;

  @Column({ name: 'finished_at', nullable: true, type: 'timestamptz' })
  public finishedAt: Date | null;
}
