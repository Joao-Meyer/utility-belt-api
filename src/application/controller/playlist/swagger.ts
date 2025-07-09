/**
 * @typedef {object} Playlist
 * @property {integer} id
 * @property {string} name
 * @property {string} imageUrl
 * @property {string} visibility -enum:PUBLIC,PRIVATE
 * @property {array<PlaylistItem>} playlistItemList
 * @property {array<Playlist>} subPlaylistList
 * @property {array<Theme>} themeList
 * @property {User} owner
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} finishedAt
 */
