import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { spawn } from 'child_process';
import cors from 'cors';
import express from 'express';
import WebTorrent from 'webtorrent';

const app = express();
const client = new WebTorrent();
const port = 4000;

const getTorrent = async (magnet) => {
  let torrent = await client.get(magnet);

  if (!torrent) {
    console.log(`Adicionando o torrent: ${magnet}`);

    torrent = await client.add(magnet);

    await new Promise((resolve, reject) => {
      torrent?.once('ready', resolve);
      torrent?.once('error', reject);
    });

    console.log('Torrent adicionado e pronto!');
  }

  return torrent;
};

const getFile = (torrentFiles, fileName) => {
  console.log(`Arquivos: ${torrentFiles?.length}`);

  const files = torrentFiles?.filter((f) => String(f.name).endsWith(fileName));

  if (!files?.length) return null;

  const file = files?.[0];

  files?.forEach((f) => f.deselect());
  file.select();

  console.log(`Arquivo selecionado: ${file.name} (${Math.round(file.length / 1e6)} MB)`);

  return file;
};

app.use(cors());

app.get('/stream', async (req, res) => {
  try {
    const magnet = String(req.query.magnet || '');
    if (!magnet) return res.status(400).send('Parâmetro "magnet" é obrigatório');

    const fileName = 'mkv';

    let torrent = await getTorrent(magnet);

    const file = getFile(torrent.files, fileName);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Connection', 'keep-alive');

    const src = file.createReadStream({ highWaterMark: 1 << 20 });

    const ff = spawn(ffmpeg.path, [
      '-hide_banner',
      '-loglevel',
      'warning',
      '-fflags',
      'nobuffer',
      '-analyzeduration',
      '0',
      '-i',
      'pipe:0',
      '-map',
      '0:v:0',
      '-map',
      '0:a:0?',
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-tune',
      'zerolatency',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      'frag_keyframe+empty_moov',
      '-f',
      'mp4',
      'pipe:1'
    ]);

    ff.stderr.setEncoding('utf8');
    ff.stderr.on('data', (chunk) => {
      console.warn('[ffmpeg]', chunk.trim());
    });

    const cleanup = (reason) => {
      console.log('cleanup:', reason);
      try {
        src.destroy();
      } catch {
        //
      }
      try {
        ff.stdin.destroy();
      } catch {
        //
      }
      try {
        ff.stdout.destroy();
      } catch {
        //
      }
      try {
        ff.kill('SIGKILL');
      } catch {
        //
      }
      try {
        res.end();
      } catch {
        //
      }
    };

    res.on('close', () => cleanup('res closed'));
    res.on('finish', () => cleanup('res finished'));
    req.on('aborted', () => cleanup('req aborted'));

    ff.on('close', (code, signal) => {
      if (code !== 0 && !res.headersSent) {
        res.statusCode = 500;
      }
      cleanup(`ffmpeg close code=${code} signal=${signal}`);
    });

    ff.stdin.on('error', (e) => {
      if (e.code !== 'EPIPE' && e.code !== 'EOF') {
        console.error('stdin error:', e);
      }
      cleanup('ffmpeg stdin error');
    });

    ff.stdout.on('error', (e) => {
      if (e.code !== 'EPIPE' && e.code !== 'EOF') {
        console.error('stdout error:', e);
      }
      cleanup('ffmpeg stdout error');
    });

    src.on('error', (e) => {
      console.error('torrent read error:', e);
      if (!res.headersSent) res.status(500).end('Erro lendo o torrent');
      cleanup('src error');
    });

    src.pipe(ff.stdin);
    ff.stdout.pipe(res);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Erro interno ao iniciar stream');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
