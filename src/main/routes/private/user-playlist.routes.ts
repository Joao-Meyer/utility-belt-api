import {
  deleteUserPlaylistController,
  findUserPlaylistController,
  insertUserPlaylistController
} from '@application/controller/user-playlist';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findUserPlaylistController());
  router.post('/:playlistId', insertUserPlaylistController());
  router.post('/:playlistId/delete', deleteUserPlaylistController());

  inputRouter.use('/user-playlist', router);
};
