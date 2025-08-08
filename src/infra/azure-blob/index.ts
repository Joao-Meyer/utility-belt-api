import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { env } from '@main/config';
import { defaultFolder, deleteFiles, errorLogger } from '@main/utils';
import { lookup as getMimeType } from 'mime-types';
import path from 'path';

const { accountKey, accountName, containerName, url } = env.AZURE_BLOB;

const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
const blobServiceClient = new BlobServiceClient(url, sharedKeyCredential);

interface uploadFileToAzureProps {
  azurePath: string;
  filepath: string;
}

export const uploadFileToAzure = async ({
  azurePath,
  filepath
}: uploadFileToAzureProps): Promise<string | null> => {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(
      azurePath.replace(`${url}${containerName}/`, '')
    );

    const extension = path.extname(defaultFolder(filepath));
    const mimeType = getMimeType(extension) || 'application/octet-stream';

    const options = { blobHTTPHeaders: { blobContentType: mimeType } };

    await blockBlobClient.uploadFile(defaultFolder(filepath), options);

    deleteFiles([filepath]);

    return blockBlobClient.url;
  } catch (error) {
    errorLogger(error);
    return null;
  }
};

export const deleteFileFromAzureByUrl = async (fileUrl: string): Promise<boolean> => {
  try {
    const blobPath = fileUrl.replace(`${url}${containerName}/`, '');

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobPath);

    const response = await blobClient.deleteIfExists();
    return response.succeeded;
  } catch (error) {
    errorLogger(error);
    return false;
  }
};
