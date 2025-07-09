import { json, urlencoded } from 'express';

export const bodyParser = json({ limit: '50mb' });

export const urlEncodedParser = urlencoded({ limit: '50mb', extended: true });
