import {
  deletePlaylistController,
  findOnePlaylistController,
  findPlaylistController,
  insertPlaylistController,
  updatePlaylistController
} from '@application/controller/playlist';
import {
  deletePlaylistItemController,
  insertPlaylistItemController,
  updatePlaylistItemController
} from '@application/controller/playlist-item';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertPlaylistController());
  router.get('/', findPlaylistController());
  router.get('/:id', findOnePlaylistController());
  router.put('/:id', updatePlaylistController());
  router.delete('/:id', deletePlaylistController());

  router.post('/:playlistId/item', insertPlaylistItemController());
  router.put('/:playlistId/item/:id', updatePlaylistItemController());
  router.delete('/:playlistId/item/:id', deletePlaylistItemController());

  inputRouter.use('/playlist', router);
};
