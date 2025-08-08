/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Controller } from '@domain/protocols';
import { uploadFileToAzure } from '@infra/azure-blob';
import type { NextFunction, Request, Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
import multer, { MulterError, diskStorage } from 'multer';
import path from 'path';
import { badRequest, messageErrorResponse } from '../api-response';
import { errorLogger } from '../error-logger';

const checkTempStorageDir = (): void => {
  const dirPath = path.join(__dirname, '..', '..', '..', 'static', 'uploads');

  if (!existsSync(dirPath)) mkdirSync(dirPath, { recursive: true });
};

const storage = diskStorage({
  destination(req: any, file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, path.join(__dirname, '..', '..', '..', 'static', 'uploads'));
  },
  filename(req: any, file: { originalname: string }, cb: (arg0: null, arg1: string) => void) {
    checkTempStorageDir();

    if (file) {
      const randomString = String(Math.random()).replace('0.', '');

      const ext = path.extname(file.originalname);

      const fileName = `${randomString}_${Date.now()}${ext}`;

      cb(null, fileName);
    }
  }
});

const fileFilter = (req: any, file: any, cb: any): void => {
  if (String(file?.mimetype)?.startsWith('image/')) cb(null, true);
  else cb(new MulterError('LIMIT_UNEXPECTED_FILE'), true);
};

const MB = 10;

export const uploadFilesMiddleware = multer({
  fileFilter,
  limits: { fileSize: MB * 1024 * 1024 },
  storage
}).array('image');

export const handleMulterError = (
  err: Error,
  req: Request,
  response: Response,
  next: NextFunction
) => {
  if (err instanceof MulterError)
    badRequest({
      response,
      lang: req.lang
    });
  else next();
};

const imagesToAzure = async (filePath: string): Promise<string | null> => {
  try {
    const url = uploadFileToAzure({ azurePath: `be-watch/${filePath}`, filepath: filePath });

    return url;
  } catch {
    return null;
  }
};

export const insertImage: Controller =
  () => async (request: Request, response: Response, next: NextFunction) => {
    try {
      const imageList: string[] = [];

      if (Array.isArray(request?.files)) {
        for await (const item of request.files) {
          const url = await imagesToAzure(item.filename);
          if (url) imageList.push(url);
        }
      }

      if (imageList?.length)
        Object.assign(request, {
          body: { ...request.body, imageList: imageList, imageUrl: imageList[0] }
        });

      next();
    } catch (error) {
      errorLogger(error);
      return messageErrorResponse({ error, response, lang: request.lang });
    }
  };
