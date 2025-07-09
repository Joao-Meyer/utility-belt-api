/**
 * @typedef {object} Errors
 * @property {string} message
 * @property {string} param
 */

/**
 * @typedef {object} BadRequest
 * @property {array<Errors>} errors
 * @property {string} message
 * @property {string} status
 */

/**
 * @typedef {object} UnauthorizedRequest
 * @property {array<Errors>} errors
 * @property {string} message
 * @property {string} status
 */

/**
 * @typedef {object} NotFoundRequest
 * @property {array<Errors>} errors
 * @property {string} message
 * @property {string} status
 */

/**
 * @typedef {object} ForbiddenRequest
 * @property {array<Errors>} errors
 * @property {string} message
 * @property {string} status
 */

/**
 * @typedef {object} DeleteResponse
 * @property {string} message
 * @property {string} payload
 * @property {string} status
 */

/**
 * @typedef {object} CreatedResponse
 * @property {string} message
 * @property {string} payload
 * @property {string} status
 */

/**
 * @typedef {object} UpdateResponse
 * @property {string} message
 * @property {string} payload
 * @property {string} status
 */
