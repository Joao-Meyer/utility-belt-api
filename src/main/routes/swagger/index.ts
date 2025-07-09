import { InfoObject, Security, Servers } from 'express-jsdoc-swagger';
import { SwaggerUiOptions } from 'swagger-ui-express';

interface Options {
  info: InfoObject;
  baseDir: string;
  filesPattern: string | string[];
  security?: Security;
  servers?: string[] | Servers[];
  exposeSwaggerUI?: boolean;
  swaggerUIPath?: string;
  exposeApiDocs?: boolean;
  apiDocsPath?: string;
  swaggerUiOptions?: SwaggerUiOptions;
  notRequiredAsNullable?: boolean;
}

export const options: Options = {
  // Open API JSON Docs endpoint.
  baseDir: __dirname,

  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,

  // Expose OpenAPI UI
  exposeSwaggerUI: true,

  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: [
    '../../../application/controller/**/*.ts',
    '../../../application/controller/**/*.js',
    './default.ts',
    './default.js'
  ],

  info: {
    description: '',
    title: 'Base API',
    version: '1.0.0'
  },

  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,

  security: {
    BearerAuth: {
      scheme: 'bearer',
      type: 'http'
    }
  },

  servers: [
    {
      description: 'Local server',
      url: '/api/v1'
    }
  ],

  swaggerUIPath: '/swagger-doc-api',

  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {
    swaggerOptions: {
      docExpansion: 'none'
    }
  }
};
