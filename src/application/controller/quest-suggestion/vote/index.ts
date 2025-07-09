import { finishedAt } from '@application/helper';
import type { Controller } from '@domain/protocols';
import { QuestEntity } from '@entity/quest';
import { QuestSuggestionEntity } from '@entity/quest-suggestion';
import { QuestSuggestionVoteEntity } from '@entity/quest-suggestion-vote';
import { UserEntity } from '@entity/user';
import { messages } from '@i18n/index';
import { DataSource } from '@infra/database';
import {
  badRequest,
  created,
  errorLogger,
  messageErrorResponse,
  notFound,
  toNumber
} from '@main/utils';
import { questSuggestionRepository } from '@repository/quest-suggestion';
import { questSuggestionVoteRepository } from '@repository/quest-suggestion-vote';
import type { Request, Response } from 'express';

interface Body {
  vote: boolean;
}

/**
 * @typedef {object} InsertQuestBody
 * @property {string} name.required
 * @property {string} description
 */

/**
 * POST /quest-suggestion/{id}/vote
 * @summary Insert Quest Suggestion
 * @tags Quest Suggestion
 * @security BearerAuth
 * @param {InsertQuestBody} request.body.required - application/json
 * @return {CreatedResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 */
export const insertQuestSuggestionVoteController: Controller =
  () =>
  async ({ lang, user, ...request }: Request, response: Response) => {
    try {
      const { vote } = request.body as Body;

      if (typeof vote !== 'boolean') return badRequest({ lang, response });

      const suggestion = await questSuggestionRepository.findOne({
        select: { id: true, name: true, description: true, createdById: true },
        where: { finishedAt, id: toNumber(request.params.id) }
      });

      if (!suggestion)
        return notFound({ entity: messages[lang].entity.suggestion, lang, response });

      const oldSuggestion = await questSuggestionVoteRepository.findOne({
        select: { id: true, vote: true },
        where: {
          userId: user.id,
          questSuggestionId: suggestion.id,
          finishedAt
        }
      });

      await DataSource.transaction(async (manager) => {
        if (oldSuggestion && oldSuggestion.vote === vote) return;

        if (oldSuggestion) {
          await manager.update(QuestSuggestionVoteEntity, { id: oldSuggestion.id }, { vote });
        } else {
          await manager.insert(QuestSuggestionVoteEntity, {
            user: { id: user.id },
            questSuggestion: { id: suggestion.id },
            vote
          });
        }

        const userCount = await manager.count(UserEntity, {
          where: { finishedAt }
        });

        const approvalCount = await manager.count(QuestSuggestionVoteEntity, {
          where: { questSuggestionId: suggestion.id, vote: true }
        });

        if (approvalCount >= userCount / 2 + 0.5) {
          await manager.insert(QuestEntity, {
            name: suggestion.name,
            description: suggestion.description,
            createdBy: { id: suggestion.createdById }
          });

          await manager.update(
            QuestSuggestionEntity,
            { id: suggestion.id },
            { finishedAt: new Date() }
          );
        }
      });

      return created({ lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
