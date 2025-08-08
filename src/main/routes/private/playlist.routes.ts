import {
  deletePlaylistController,
  findOnePlaylistController,
  findOnePlaylistParentController,
  findPlaylistController,
  insertPlaylistController,
  updatePlaylistController
} from '@application/controller/playlist';
import {
  deletePlaylistItemController,
  insertPlaylistItemController,
  updatePlaylistItemController
} from '@application/controller/playlist-item';
import { handleMulterError, insertImage, uploadFilesMiddleware } from '@main/utils';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post(
    '/',
    uploadFilesMiddleware,
    handleMulterError,
    insertImage(),
    insertPlaylistController()
  );
  router.get('/', findPlaylistController());
  router.get('/:id', findOnePlaylistController());
  router.get('/:parentId/:id', findOnePlaylistParentController());
  router.put(
    '/:id',
    uploadFilesMiddleware,
    handleMulterError,
    insertImage(),
    updatePlaylistController()
  );
  router.delete('/:id', deletePlaylistController());

  router.post('/:playlistId/item', insertPlaylistItemController());
  router.put('/:playlistId/item/:id', updatePlaylistItemController());
  router.delete('/:playlistId/item/:id', deletePlaylistItemController());

  inputRouter.use('/playlist', router);
};
