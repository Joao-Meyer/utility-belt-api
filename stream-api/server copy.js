import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { spawn } from 'child_process';
import cors from 'cors';
import express from 'express';
import WebTorrent from 'webtorrent';

const app = express();
const client = new WebTorrent();
const port = 4000;

app.use(cors());

app.get('/stream', async (req, res) => {
  try {
    const magnet = String(req.query.magnet || '');
    if (!magnet) return res.status(400).send('Parâmetro "magnet" é obrigatório');

    const fileExt = 'mkv'.toString().toLowerCase();

    // Reaproveita torrent se já estiver no cliente
    let torrent = await client.get(magnet);

    if (!torrent) {
      console.log(`Adicionando o torrent: ${magnet}`);
      torrent = await client.add(magnet); // opcional: remova path p/ não persistir
      await new Promise((resolve, reject) => {
        torrent.once('ready', resolve);
        torrent.once('error', reject);
      });
      console.log('Torrent adicionado e pronto!');
    }

    // Pega o maior arquivo que termina com a extensão desejada
    const files = torrent.files?.filter((f) => f.name.toLowerCase().endsWith(`.${fileExt}`));
    if (!files?.length) return res.status(404).send('Arquivo .mkv não encontrado no torrent');

    const file = files.sort((a, b) => b.length - a.length)[0];
    console.log(`Arquivo selecionado: ${file.name} (${Math.round(file.length / 1e6)} MB)`);

    // Prioriza download do arquivo
    file.select();

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Connection', 'keep-alive');
    // Express já usa chunked por padrão ao fazer pipe do stdout

    const src = file.createReadStream({ highWaterMark: 1 << 20 }); // 1MB buffers

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
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      'frag_keyframe+empty_moov',
      '-f',
      'mp4',
      'pipe:1'
    ]);

    // (1) LOGAR por que o ffmpeg fecha
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

    // Se o cliente fechou a aba/conexão
    res.on('close', () => cleanup('res closed'));
    res.on('finish', () => cleanup('res finished'));
    req.on('aborted', () => cleanup('req aborted'));

    // Se o ffmpeg parou, não continue escrevendo
    ff.on('close', (code, signal) => {
      // 0 = OK, qualquer outro = falhou
      if (code !== 0 && !res.headersSent) {
        res.statusCode = 500;
      }
      cleanup(`ffmpeg close code=${code} signal=${signal}`);
    });

    // Se escrever em stdin depois que o ffmpeg fechou, dá EPIPE/EOF — ignore
    ff.stdin.on('error', (e) => {
      if (e.code !== 'EPIPE' && e.code !== 'EOF') {
        console.error('stdin error:', e);
      }
      cleanup('ffmpeg stdin error');
    });

    // Se tentar escrever no res fechado, também explode — ignore
    ff.stdout.on('error', (e) => {
      if (e.code !== 'EPIPE' && e.code !== 'EOF') {
        console.error('stdout error:', e);
      }
      cleanup('ffmpeg stdout error');
    });

    // Se a leitura do torrent cair, encerre tudo
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
