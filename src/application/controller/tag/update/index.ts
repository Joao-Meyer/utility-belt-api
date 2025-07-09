import { updateTagSchema } from '@data/validation';
import type { Controller } from '@domain/protocols';
import { messages } from '@i18n/index';
import { errorLogger, messageErrorResponse, ok, toNumber } from '@main/utils';
import { tagRepository } from '@repository/tag';
import type { Request, Response } from 'express';

interface Body {
  name: string;
}

/**
 * @typedef {object} UpdateTagBody
 * @property {string} name.required
 */

/**
 * PUT /tag/{id}
 * @summary Update Tag
 * @tags Tag
 * @security BearerAuth
 * @param {UpdateTagBody} request.body
 * @param {string} id.path.required
 * @return {UpdateResponse} 200 - Successful response - application/json
 * @return {BadRequest} 400 - Bad request response - application/json
 * @return {UnauthorizedRequest} 401 - Unauthorized response - application/json
 * @return {ForbiddenRequest} 403 - Forbidden response - application/json
 */
export const updateTagController: Controller =
  () =>
  async ({ lang, ...request }: Request, response: Response) => {
    try {
      await updateTagSchema.validate(request, { abortEarly: false });

      const { name } = request.body as Body;

      await tagRepository.update({ id: toNumber(request.params.id) }, { name });

      return ok({ payload: messages[lang].default.successfullyUpdated, lang, response });
    } catch (error) {
      errorLogger(error);

      return messageErrorResponse({ error, lang, response });
    }
  };
