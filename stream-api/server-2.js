import { path } from '@ffmpeg-installer/ffmpeg';
import { spawn } from 'child_process';
import cors from 'cors';
import express from 'express';
import WebTorrent from 'webtorrent';

const app = express();
const client = new WebTorrent();
const port = 4000;

app.use(cors());

app.get('/stream', (req, res) => {
  const magnet = req.query.magnet;
  const fileType = 'mkv';

  console.log(`Adicionando o torrent: ${magnet}`);

  client.add(magnet, { path: './downloads' }, (torrent) => {
    console.log('Torrent adicionado com sucesso!');

    const file = torrent.files.find((f) => f.name.endsWith(fileType));

    if (!file) {
      return res.status(404).send('Arquivo não encontrado no torrent');
    }

    console.log(`Arquivo encontrado: ${file.name}`);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Connection', 'keep-alive');

    if (fileType === 'mkv') {
      console.log(`Iniciando a conversão, bytes baixados: `);

      const ffmpeg = spawn(path, [
        '-i',
        'pipe:0',
        '-c:v',
        'libx264',
        '-f',
        'mp4',
        '-movflags',
        'frag_keyframe+empty_moov',
        '-'
      ]);

      file.createReadStream().pipe(ffmpeg.stdin);

      ffmpeg.stdout.pipe(res);

      ffmpeg.on('error', (err) => {
        console.error('Erro ao converter o vídeo:', err);
        res.status(500).send('Erro ao converter o vídeo');
      });

      ffmpeg.on('close', () => {
        console.log('Conversão finalizada');
      });
    } else {
      res.status(400).send('Tipo de arquivo inválido');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
