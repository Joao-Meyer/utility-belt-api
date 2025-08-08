import {
  deleteUserPlaylistController,
  findOneUserPlaylistController,
  findUserPlaylistAllController,
  findUserPlaylistController,
  insertUserPlaylistController
} from '@application/controller/user-playlist';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.get('/', findUserPlaylistController());
  router.get('/all', findUserPlaylistAllController());
  router.get('/:id', findOneUserPlaylistController());
  router.post('/:playlistId', insertUserPlaylistController());
  router.post('/:playlistId/delete', deleteUserPlaylistController());

  inputRouter.use('/user-playlist', router);
};
