import {
  findQuestSuggestionController,
  insertQuestSuggestionController,
  insertQuestSuggestionVoteController
} from '@application/controller/quest-suggestion';
import { findQuestSuggestionNeedVoteController } from '@application/controller/quest-suggestion/need-vote';
import { Router } from 'express';

export default (inputRouter: Router): void => {
  const router = Router();

  router.post('/', insertQuestSuggestionController());
  router.get('/', findQuestSuggestionController());
  router.post('/:id/vote', insertQuestSuggestionVoteController());
  router.get('/need-vote', findQuestSuggestionNeedVoteController());

  inputRouter.use('/quest-suggestion', router);
};
