import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { spawn } from 'child_process';
import cors from 'cors';
import express from 'express';
import WebTorrent from 'webtorrent';

const app = express();
const client = new WebTorrent();
const port = 4000;

app.use(cors({ origin: '*' }));

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

  const files = torrentFiles?.filter((f) => f.name === fileName);

  if (!files?.length) return null;

  const file = files?.[0];

  files?.forEach((f) => f.deselect());
  file.select();

  console.log(`Arquivo selecionado: ${file.name} (${Math.round(file.length / 1e6)} MB)`);

  return file;
};

app.get('/subtitles', cors({ origin: '*' }), async (req, res) => {
  const origin = req.headers.origin;

  res.setHeader('Content-Type', 'text/vtt; charset=utf-8');

  if (origin === 'http://localhost:5173' || origin === 'https://seu-site.com') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  try {
    const magnet = String(req.query.magnet || '');
    if (!magnet) return res.status(400).send('Parâmetro "magnet" é obrigatório');

    // Se tiver vários arquivos no torrent, você já sabe qual MKV quer.
    const fileName = '[Avalon] Steins;Gate - 01 (BDRip 1080p 10bit x264 FLAC) [rich_jc].mkv';

    // Seleção de trilha por index ou language
    const sidx = req.query.sidx != null ? Number(req.query.sidx) : undefined; // ex: 0,1,2...
    const lang = typeof req.query.lang === 'string' ? req.query.lang.toLowerCase() : undefined; // ex: 'por', 'eng'
    const format = String(req.query.format || 'vtt').toLowerCase(); // 'vtt' | 'srt'

    if (format !== 'vtt' && format !== 'srt') {
      return res.status(400).send('Formato inválido. Use "vtt" ou "srt".');
    }

    let torrent = await getTorrent(magnet);
    if (!torrent) return res.status(404).send('Arquivo torrent não encontrado');

    const file = getFile(torrent.files, fileName);
    if (!file) return res.status(404).send('Arquivo .mkv não encontrado no torrent');

    // Cabeçalhos pro stream de legenda
    if (format === 'vtt') {
      res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    } else {
      res.setHeader('Content-Type', 'application/x-subrip; charset=utf-8'); // SRT
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Content-Disposition', 'inline; filename="subtitles.' + format + '"');

    // Streama o MKV pro ffmpeg
    const src = file.createReadStream({ highWaterMark: 1 << 20 });

    // Monta mapeamento da legenda:
    // prioridade: sidx > lang > default (0:s:0)
    const mapArgs = [];
    if (Number.isInteger(sidx)) {
      mapArgs.push('-map', `0:s:${sidx}`);
    } else if (lang) {
      // mapeia por language metadata se tiver
      mapArgs.push('-map', `0:s:m:language:${lang}?`);
    } else {
      mapArgs.push('-map', '0:s:0?');
    }

    // Codec/format pra legenda
    const subCodec = format === 'vtt' ? 'webvtt' : 'srt';
    const subFormat = format === 'vtt' ? 'webvtt' : 'srt';

    const args = [
      '-hide_banner',
      '-loglevel',
      'warning',

      // input via pipe
      '-fflags',
      '+genpts+nobuffer',
      '-probesize',
      '1M',
      '-analyzeduration',
      '0',
      '-i',
      'pipe:0',

      // map only subtitle stream
      ...mapArgs,

      // converter p/ texto (se for ass/srt). Para PGS, isso vai falhar (imagem).
      '-c:s',
      subCodec,

      // saída como webvtt ou srt
      '-f',
      subFormat,
      'pipe:1'
    ];

    const ff = spawn(ffmpeg.path, args);

    ff.stderr.setEncoding('utf8');
    ff.stderr.on('data', (t) => console.warn('[ffmpeg]', t.trim()));

    const cleanup = (reason) => {
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
      console.log('cleanup:', reason);
    };

    res.on('close', () => cleanup('res closed'));
    res.on('finish', () => cleanup('res finished'));
    req.on('aborted', () => cleanup('req aborted'));

    ff.on('close', (code, signal) => {
      if (code !== 0 && !res.headersSent) res.statusCode = 500;
      cleanup(`ffmpeg close code=${code} signal=${signal}`);
    });

    ff.stdin.on('error', (e) => {
      if (e.code !== 'EPIPE' && e.code !== 'EOF') console.error('stdin error:', e);
      cleanup('ffmpeg stdin error');
    });

    ff.stdout.on('error', (e) => {
      if (e.code !== 'EPIPE' && e.code !== 'EOF') console.error('stdout error:', e);
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
    return res.status(500).send('Erro interno ao iniciar stream de legenda');
  }
});

app.get('/stream', async (req, res) => {
  console.log(`aaaaaaaa`);

  try {
    const magnet = String(req.query.magnet || '');
    if (!magnet) return res.status(400).send('Parâmetro "magnet" é obrigatório');

    const fileName = '[Avalon] Steins;Gate - 01 (BDRip 1080p 10bit x264 FLAC) [rich_jc].mkv';

    let torrent = await getTorrent(magnet);

    if (!torrent) return res.status(404).send('Arquivo torrent não encontrado no torrent');

    const file = getFile(torrent.files, fileName);

    if (!file) return res.status(404).send('Arquivo .mkv não encontrado no torrent');

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Connection', 'keep-alive');

    const src = file.createReadStream({ highWaterMark: 1 << 20 });

    const args = [
      '-hide_banner',
      '-loglevel',
      'warning',

      // Entrada via pipe
      '-fflags',
      '+genpts+nobuffer',
      '-probesize',
      '1M',
      '-analyzeduration',
      '0',
      '-i',
      'pipe:0',

      // Selecione 1 vídeo e 1 áudio (ajuste aidx/vidx se expôs na query)
      '-map',
      '0:v:0',
      '-map',
      '0:a:0?',

      // Vídeo: de 10-bit pra 8-bit H.264
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-tune',
      'zerolatency',
      '-pix_fmt',
      'yuv420p',
      '-g',
      '48',
      '-keyint_min',
      '48',

      // limite opcional de taxa (bom pra TVs/players chatos)
      '-maxrate',
      '5000k',
      '-bufsize',
      '10000k',

      // Áudio: FLAC -> AAC com sync
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-af',
      'aresample=async=1',

      // Muxer MP4 “live”
      '-movflags',
      'frag_keyframe+empty_moov',
      '-muxpreload',
      '0',
      '-muxdelay',
      '0',
      '-max_muxing_queue_size',
      '4096',

      // Saída
      '-f',
      'mp4',
      'pipe:1'
    ];

    const ff = spawn(ffmpeg.path, args);

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

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${port}`);
});
