import fs from 'fs';
import { defaultFolder } from '../default-folder';

export const deleteFiles = (files: string[]): void => {
  try {
    files.forEach((file) => {
      fs.unlinkSync(defaultFolder(file));
    });
  } catch {
    /* */
  }
};
