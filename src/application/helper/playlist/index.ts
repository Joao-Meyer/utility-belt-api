import { DataSource } from '@infra/database';
import { playlistItemRepository } from '@repository/playlist-item';
import { finishedAt } from '../finished-at';

export const canUpdatePlaylist = async (
  targetPlaylistId: number,
  userId: number,
  onlyOwner = false
): Promise<boolean> => {
  const result = await DataSource.query(
    `
    WITH RECURSIVE playlist_hierarchy AS (
      SELECT id, parent_id
      FROM playlist
      WHERE id = $1
      UNION ALL
      SELECT p.id, p.parent_id
      FROM playlist p
      INNER JOIN playlist_hierarchy ph ON p.id = ph.parent_id
    )
    SELECT 1
    FROM playlist_hierarchy ph
    INNER JOIN user_playlist up ON up.playlist_id = ph.id
    WHERE up.user_id = $2
      AND ${onlyOwner ? 'up.is_owner = true' : '(up.is_collaborator = true OR up.is_owner = true)'}
    LIMIT 1;
    `,
    [targetPlaylistId, userId]
  );

  return result?.length > 0;
};

export const canUpdatePlaylistItem = async (
  id: number,
  playlistId: number,
  userId: number,
  onlyOwner = false
): Promise<boolean> => {
  const playlistItem = await playlistItemRepository.findOne({
    where: { id, playlistId, finishedAt }
  });

  if (!playlistItem) return false;

  return await canUpdatePlaylist(playlistId, userId, onlyOwner);
};
